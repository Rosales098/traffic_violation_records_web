import * as yup from 'yup';

export const VehicleMakeSchema = yup
  .object({
    vehicleMake: yup.string().required('Vehicle make is required').min(2, 'Vehicle make must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
  })
  .required();
