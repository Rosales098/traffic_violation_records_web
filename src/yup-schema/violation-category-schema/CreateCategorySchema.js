import * as yup from 'yup';

export const CreateCategorySchema = yup
  .object({
    categoryName: yup.string().required('Category name is required').min(2, 'Category name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
  })
  .required();
