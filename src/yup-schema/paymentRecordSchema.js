import * as yup from 'yup';

export const PaymentRecordSchema = yup
  .object({
    payee: yup.string().required('Payee is required'),
    paymentDate: yup.string().required('Payment Date is required'),
    paymentMethod: yup.string().required('Payment Method is required'),
    remarks: yup.string().required('Remarks is required')
  })
  .required();
