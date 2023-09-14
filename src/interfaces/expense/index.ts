import { TenantInterface } from 'interfaces/tenant';
import { GetQueryInterface } from 'interfaces';

export interface ExpenseInterface {
  id?: string;
  expense_date: any;
  amount: number;
  category: string;
  tenant_id: string;
  created_at?: any;
  updated_at?: any;

  tenant?: TenantInterface;
  _count?: {};
}

export interface ExpenseGetQueryInterface extends GetQueryInterface {
  id?: string;
  category?: string;
  tenant_id?: string;
}
