import { TenantInterface } from 'interfaces/tenant';
import { GetQueryInterface } from 'interfaces';

export interface TaxInterface {
  id?: string;
  tax_type: string;
  tax_rate: number;
  tenant_id: string;
  created_at?: any;
  updated_at?: any;

  tenant?: TenantInterface;
  _count?: {};
}

export interface TaxGetQueryInterface extends GetQueryInterface {
  id?: string;
  tax_type?: string;
  tenant_id?: string;
}
