import * as yup from 'yup';

export const UpdateUserPasswordSchema = yup
  .object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().required('New password is required').min(6, 'Password must be atleast 6 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
  })
  .required();
