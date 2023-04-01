import * as yup from 'yup';

export const CreateUserSchema = yup
  .object({
    firstName: yup.string().required('First name is required').min(2, 'First name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    middleName: yup.string().required('Middle name is required').min(2, 'Middle name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    gender: yup.string().required('Gender is required'),
    phoneNumber: yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Numbers only').min(11, 'Phone number must be 11 digits').matches(/^(09|\+639)\d{9}$/gm, 'Invalid phone number'),
    dob: yup.string().required('Date of birth is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Please enter your Email'),
    password: yup.string().required('Please enter your Password').min(6, "Password must be atleast 6 characters."),
    confirmPassword: yup
      .string()
      .required('Please enter your Password')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    role: yup.string().required('Role is required'),
  })
  .required();
