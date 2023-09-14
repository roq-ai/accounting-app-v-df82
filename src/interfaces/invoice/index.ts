import { TenantInterface } from 'interfaces/tenant';
import { GetQueryInterface } from 'interfaces';

export interface InvoiceInterface {
  id?: string;
  invoice_number: string;
  invoice_date: any;
  due_date: any;
  total_amount: number;
  tenant_id: string;
  created_at?: any;
  updated_at?: any;

  tenant?: TenantInterface;
  _count?: {};
}

export interface InvoiceGetQueryInterface extends GetQueryInterface {
  id?: string;
  invoice_number?: string;
  tenant_id?: string;
}
