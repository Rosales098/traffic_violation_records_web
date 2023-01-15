import * as Yup from 'yup';

import { useState, useMemo,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// BUBU
// components
import Iconify from '../Iconify';
import { FormProvider, RHFTextField } from '../hook-form';

// ----------------------------------------------------------------------

export default function CreateUserForm() {
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().required('First name required'),
    lastname: Yup.string().required('Last name required'),
    timezone: Yup.string().required('Timezone is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Your password must be atleat 6 characters.'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    timezone: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      timezone: data.timezone,
    };
    // try {
    //   await registerUser(payload);
    //   toast.success('Email verification sent');
    //   return navigate('/login');
    // } catch (error) {
    //   toast.error(error.response.data.message);
    //   setIsLoading(false);
    // }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstname" label="First name" />
          <RHFTextField name="lastname" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={4}>
          <Box width="60%">
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
              Register
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
