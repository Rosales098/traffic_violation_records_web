/* eslint-disable prettier/prettier */
import * as yup from 'yup';

export const licenseSchema = yup
  .object({
    licenseNumber: yup
      .string()
      // .required('License number is required')
      .min(13, 'License number is too short'),
    licenseType: yup.string().required('License type is required'),
    licenseStatus: yup.string().required('License status is required'),
  })
  .required();
