import * as yup from 'yup';

export const taxValidationSchema = yup.object().shape({
  tax_type: yup.string().required(),
  tax_rate: yup.number().integer().required(),
  tenant_id: yup.string().nullable().required(),
});
