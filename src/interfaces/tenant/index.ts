import { BankAccountInterface } from 'interfaces/bank-account';
import { ExpenseInterface } from 'interfaces/expense';
import { InvoiceInterface } from 'interfaces/invoice';
import { TaxInterface } from 'interfaces/tax';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TenantInterface {
  id?: string;
  description?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  bank_account?: BankAccountInterface[];
  expense?: ExpenseInterface[];
  invoice?: InvoiceInterface[];
  tax?: TaxInterface[];
  user?: UserInterface;
  _count?: {
    bank_account?: number;
    expense?: number;
    invoice?: number;
    tax?: number;
  };
}

export interface TenantGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
