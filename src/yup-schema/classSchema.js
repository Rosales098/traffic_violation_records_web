import * as yup from 'yup';

export const VehicleClassSchema = yup
  .object({
    vehicleClass: yup.string().required('Vehicle class is required').min(2, 'Vehicle class must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
  })
  .required();
