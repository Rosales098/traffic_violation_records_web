import { useState, useMemo,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../Iconify';
import { FormProvider, RHFTextField } from '../hook-form';
import UserApi from '../../service/UserApi';

// schema
import { CreateUserSchema } from '../../yup-schema/user-schema/CreateUserSchema';


// ----------------------------------------------------------------------
const genderData = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'}
]

const positionData = [
  {value: 'enforcer', label: 'Enforcer'},
  {value: 'admin', label: 'Admin'},
  {value: 'treasurer', label: 'Treasurer'},
]
export default function CreateUserForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {createUser} = UserApi;
  
  const defaultValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    dob: new Date(),
    gender: 'male',
    role: 'enforcer',
  };

  const methods = useForm({
    resolver: yupResolver(CreateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  

  const { mutate: CreateUser, isLoading: isLoad } = useMutation((payload) => createUser(payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-all-users']);
      toast.success('Created successfully');
      setIsLoading(true);
      navigate(-1);
    },
    onError: (data) => {
      console.log(data)
      toast.error(data.response.data.message);
      setIsLoading(false);
    },
  });

  const onSubmit = async (data) => {
    console.log(data)
    setIsLoading(true);
    const payload = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      gender: data.gender,
      phone_number: data.phoneNumber,
      dob: moment(data.dob).format("MM/DD/YYYY"),
      role: data.role,
      email: data.email,
      password: data.confirmPassword,
    };
      await CreateUser(payload);
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="middleName" label="Last name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="gender" label="Gender" inputType='dropDown' dropDownData={genderData} />
          <RHFTextField name="phoneNumber" label="Phone Number" type="number" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="dob" label="Date of Birth" inputType='datePicker' />
          <RHFTextField name="role" label="Role" inputType='dropDown' dropDownData={positionData}/>
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
          <Box width="100%">
            <LoadingButton fullWidth size="large" variant="contained" loading={isLoading} type="submit">
              Create
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
