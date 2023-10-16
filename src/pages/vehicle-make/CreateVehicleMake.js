/* eslint-disable camelcase */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// BUBU
// components

import { RHFTextField, FormProvider } from '../../components/hook-form';
import ViolationCategoriesApi from '../../service/ViolationCategoriesApi';
import vehicleApi from '../../service/vehicleApi';
import { VehicleMakeSchema } from '../../yup-schema/makeSchema';

// schema

// ----------------------------------------------------------------------

export default function CreateMake({ handleClose, action, setAction, deleteUserHandler }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(null);
  const { createMake, updateMake } = vehicleApi;
  const { vehicleMake } = useSelector((store) => store.vehicle);
  console.log(vehicleMake);

  const defaultValues = {
    vehicleMake: '',
  };

  const methods = useForm({
    resolver: yupResolver(VehicleMakeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const { mutate: Create, isLoading: isLoad } = useMutation((payload) => createMake(payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-all-make']);
      toast.success('Created successfully');
      setIsLoading(false);
      handleClose();
    },
    onError: (data) => {
      console.log(data);
      toast.error(data.response.data.message);
      setIsLoading(false);
    },
  });

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => updateMake(vehicleMake.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['get-all-make']);
        toast.success('Updated successfully');
        setIsLoading(false);
        handleClose();
      },
      onError: (data) => {
        console.log('error', data);
        toast.error(data.response.data.message);
        setIsLoading(false);
      },
    }
  );

  const setMakeHandler = useCallback(() => {
    const { make } = vehicleMake;

    reset({
      vehicleMake: make,
    });
  }, [vehicleMake, reset]);

  useEffect(() => {
    setMakeHandler();
  }, [setMakeHandler]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      make: data.vehicleMake,
    };
    if (action === 'create') {
      return Create(payload);
    }
    await Update(payload);
  };

  const actionHandler = () => {
    if (action === 'create') {
      return (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="vehicleMake" label="Vehicle Make" />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'flex-end', mt: 7 }}>
            <Button variant="text" onClick={() => handleClose()}>
              Cancel
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isLoading}>
              Create
            </LoadingButton>
          </Stack>
        </>
      );
    }
    if (action === 'update') {
      return (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="vehicleMake" label="Vehicle Make" />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'flex-end', mt: 7 }}>
            <Button variant="text" onClick={() => handleClose()}>
              Cancel
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isLoading}>
              Update
            </LoadingButton>
          </Stack>
        </>
      );
    }

    return (
      <>
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>
          Are you sure you want to delete this category?
        </Typography>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'flex-end', mt: 7 }}>
          <Button variant="text" onClick={() => handleClose()}>
            Cancel
          </Button>
          <LoadingButton
            variant="outlined"
            color="error"
            loading={isLoading}
            onClick={() => {
              deleteUserHandler();
            }}
          >
            Delete
          </LoadingButton>
        </Stack>
      </>
    );
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {actionHandler()}
      </Stack>
    </FormProvider>
  );
}
