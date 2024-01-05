/* eslint-disable prettier/prettier */
import * as yup from 'yup';

export const violatorSchema = yup
  .object({
    lastName: yup
      .string()
      .required('Last name is required')
      .min(2, 'Last name must be atleast 2 letters')
      // .matches(/^[A-Za-z]+$/, 'Letters only')
      ,
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
    // gender: yup.string().required('Gender is required'),
    municipality: yup.string().required('Mucipality is required'),
    zipcode: yup.string().required('Zip code is required'),
    barangay: yup.string().required('Barangay is required'),
    street: yup.string().required('Street is required'),
    nationality: yup.string().required('Nationality is required'),
    phoneNumber: yup
      .string()
      .required('Phone number is required')
      .min(11, 'Phone number must be 11 digits')
      .matches(/^[0-9]+$/, 'Numbers only')
      .matches(/^(09|\+639)\d{9}$/gm, 'Invalid phone number'),
    dob: yup.string().required('Date of birth is required'),
  })
  .required();
