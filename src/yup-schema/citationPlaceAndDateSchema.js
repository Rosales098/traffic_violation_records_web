/* eslint-disable prettier/prettier */
import * as yup from 'yup';

export const citationPlaceAndDateSchema = yup
  .object({
    tct: yup.string().required('TCT is required'),
    violationDate: yup.string().required('Date is required'),
    violationTime: yup.string().required('Time is required'),
    municipality: yup.string().required('Mucipality is required'),
    zipcode: yup.string().required('Zip code is required'),
    barangay: yup.string().required('Barangay is required'),
    street: yup.string().required('Street is required'),
  })
  .required();
