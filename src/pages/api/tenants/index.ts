import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { tenantValidationSchema } from 'validationSchema/tenants';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTenants();
    case 'POST':
      return createTenant();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTenants() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.tenant
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'tenant'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createTenant() {
    await tenantValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.bank_account?.length > 0) {
      const create_bank_account = body.bank_account;
      body.bank_account = {
        create: create_bank_account,
      };
    } else {
      delete body.bank_account;
    }
    if (body?.expense?.length > 0) {
      const create_expense = body.expense;
      body.expense = {
        create: create_expense,
      };
    } else {
      delete body.expense;
    }
    if (body?.invoice?.length > 0) {
      const create_invoice = body.invoice;
      body.invoice = {
        create: create_invoice,
      };
    } else {
      delete body.invoice;
    }
    if (body?.tax?.length > 0) {
      const create_tax = body.tax;
      body.tax = {
        create: create_tax,
      };
    } else {
      delete body.tax;
    }
    const data = await prisma.tenant.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
