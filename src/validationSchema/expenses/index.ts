import * as yup from 'yup';

export const expenseValidationSchema = yup.object().shape({
  expense_date: yup.date().required(),
  amount: yup.number().integer().required(),
  category: yup.string().required(),
  tenant_id: yup.string().nullable().required(),
});
