import * as yup from 'yup';

export const bankAccountValidationSchema = yup.object().shape({
  bank_name: yup.string().required(),
  account_number: yup.string().required(),
  balance: yup.number().integer().required(),
  tenant_id: yup.string().nullable().required(),
});
