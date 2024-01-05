/* eslint-disable prettier/prettier */
import * as yup from 'yup';

export const citationSchema = yup
  .object({
    lastName: yup
      .string()
      .required('Last name is required')
      .min(2, 'Last name must be atleast 2 letters')
      .matches(/^[A-Za-z]+$/, 'Letters only'),
    firstName: yup
      .string()
      .required('First name is required')
      .min(2, 'First name must be atleast 2 letters')
      .matches(/^[A-Za-z]+$/, 'Letters only'),
    middleName: yup
      .string()
      .required('Middle name is required')
      .min(2, 'Middle name must be atleast 2 letters')
      .matches(/^[A-Za-z]+$/, 'Letters only'),
    gender: yup.string().required('Gender is required'),
    address: yup.string().required('Address is required'),
    phoneNumber: yup
      .string()
      .required('Phone number is required')
      .min(11, 'Phone number must be 11 digits')
      .matches(/^[0-9]+$/, 'Numbers only')
      .matches(/^(09|\+639)\d{9}$/gm, 'Invalid phone number'),
    dob: yup.string().required('Date of birth is required'),
    licenseNumber: yup
      .string()
      .required('License number is required')
      .min(13, 'License number is too short'),
    licenseType: yup.string().required('License type is required'),
    plateNumber: yup.string().required('Plate number is required'),
    make: yup.string().required('Make is required'),
    model: yup.string().required('Model is required'),
    color: yup.string().required('Color is required'),
    registeredOwner: yup.string().required('Registered owner is required'),
  })
  .required();
