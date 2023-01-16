import * as yup from 'yup';

export const ViolationSchema = yup
  .object({
    categoryId: yup.string().required('Category is required'),
    violation: yup.string().required('Violation name is required').min(2, 'Violation name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    penalty: yup.string().required('Penalty amount is required').matches(/^[0-9]+$/, 'Numbers only'),
    description: yup.string().required('Description is required').min(2, 'Description must be atleast 2 letters'),
  })
  .required();
