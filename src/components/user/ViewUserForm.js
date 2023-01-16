/* eslint-disable camelcase */
import { useState, useMemo, useEffect, useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../Iconify';
import { FormProvider, RHFTextField } from '../hook-form';
import SecurityForm from './SecurityForm';
import UserApi from '../../service/UserApi';

// schema
import { UpdateUserSchema } from '../../yup-schema/user-schema/UpdateUserSchema';
import { UpdateUserPasswordSchema } from '../../yup-schema/user-schema/UpdateUserPasswordSchema';

// ----------------------------------------------------------------------
const genderData = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const statusData = [
  { value: '1', label: 'Activated' },
  { value: '0', label: 'Deactivated' },
];

const positionData = [
  { value: 'enforcer', label: 'Enforcer' },
  { value: 'admin', label: 'Admin' },
  { value: 'treasurer', label: 'Treasurer' },
];
export default function ViewUserForm({ currentPage, onSubmit, isLoading, setIsLoading, user }) {
  
  const {updatePassword} = UserApi;
  const methods = useForm({
    resolver: yupResolver(currentPage === 'details' ? UpdateUserSchema : UpdateUserPasswordSchema),
    // defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const setUserHandler = useCallback(() => {
    const {
      first_name,
      middle_name,
      last_name,
      gender,
      dob,
      phone_number,
      role,
      status,
    } = user;

    reset({
      firstName: first_name,
      middleName: middle_name,
      lastName: last_name,
      phoneNumber: phone_number,
      gender,
      dob,
      role,
      status,
    });
  }, [user]);

  useEffect(() => {
    setUserHandler();
  }, [setUserHandler]);

  const { mutate: Update, isLoading: isLoad } = useMutation((payload) => updatePassword(payload), {
    onSuccess: (data) => {
      toast.success('Updated successfully');
      setIsLoading(false);
    },
    onError: (data) => {
      toast.error(data.response.data.message);
      setIsLoading(false);
    },
  });
  const passwordUpdate = async (data) => {
    setIsLoading(true);
    const payload = {
      email: user.email,
      current_password: data.currentPassword,
      new_password: data.newPassword,
    };
    await Update(payload);
    
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(currentPage === 'details' ? onSubmit : passwordUpdate)}>
      <Stack spacing={3}>
        {currentPage === 'details' ? (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="middleName" label="Last name" />
              <RHFTextField name="lastName" label="Last name" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="gender" label="Gender" inputType="dropDown" dropDownData={genderData} />
              <RHFTextField name="phoneNumber" label="Phone Number" type="number" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="dob" label="Date of Birth" inputType="datePicker" />
              <RHFTextField name="role" label="Role" inputType="dropDown" dropDownData={positionData} />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="status" label="Status" inputType="dropDown" dropDownData={statusData} />
            </Stack>
          </>
        ) : (
          <SecurityForm />
        )}
        <Stack direction="row" spacing={4}>
          <Box width="100%">
            <LoadingButton fullWidth size="large" variant="contained" loading={isLoading} type="submit">
              Update
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
