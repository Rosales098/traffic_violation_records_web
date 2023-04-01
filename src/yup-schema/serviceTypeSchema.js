import * as yup from 'yup';

export const ServiceTypeSchema = yup
  .object({
    serviceName: yup.string().required('Service name is required').min(2, 'Service name must be atleast 2 letters'),
    discount: yup.string().required('Discount is required').matches(/^[0-9]+$/, 'Numbers only'),
    timeToRender: yup.string().required('Time to Render is required').matches(/^[0-9]+$/, 'Numbers only'),
  })
  .required();
