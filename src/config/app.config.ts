interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Admin'],
  customerRoles: ['Guest'],
  tenantRoles: ['Admin', 'Accountant', 'Viewer', 'Tenant'],
  tenantName: 'Tenant',
  applicationName: 'Accounting APP v2',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: ['Interact with the tenant without access to sensitive financial data or functions.'],
  ownerAbilities: [
    'Manage own account',
    'Invite and manage roles',
    'Manage tenants',
    'Customize settings and configurations',
  ],
  getQuoteUrl: 'https://app.roq.ai/proposal/c798472d-e4fd-482a-a756-c8c13a978e87',
};
