import { TenantInterface } from 'interfaces/tenant';
import { GetQueryInterface } from 'interfaces';

export interface BankAccountInterface {
  id?: string;
  bank_name: string;
  account_number: string;
  balance: number;
  tenant_id: string;
  created_at?: any;
  updated_at?: any;

  tenant?: TenantInterface;
  _count?: {};
}

export interface BankAccountGetQueryInterface extends GetQueryInterface {
  id?: string;
  bank_name?: string;
  account_number?: string;
  tenant_id?: string;
}
