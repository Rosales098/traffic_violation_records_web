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
import ViolationsApi from '../../service/ViolationsApi';
import { ViolationSchema } from '../../yup-schema/violation-schema/ViolationSchema';

// schema

// ----------------------------------------------------------------------

export default function CreateViolation({ handleClose, action, setAction, categoryList}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { createViolation, updateViolation, deleteViolation } = ViolationsApi;
  const [isLoading, setIsLoading] = useState(null);

  const { violation } = useSelector((store) => store.violation);

  const defaultValues = {
    categoryId: 1,
    violation: '',
    penalty: '',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(ViolationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const { mutate: Create, isLoading: isLoad } = useMutation((payload) => createViolation(payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-all-violations']);
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
    (payload) => updateViolation(violation.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['get-all-violations']);
        toast.success('Updated successfully');
        setIsLoading(false);
        handleClose();
      },
      onError: (data) => {
        toast.error(data.response.data.message ? data.response.data.message : data.response.data);
        setIsLoading(false);
      },
    }
  );

  const setCategoryHandler = useCallback(() => {
    const { violation_categories_id, violation_name, penalty, description } = violation;

    reset({
      categoryId: violation_categories_id,
      violation: violation_name,
      penalty,
      description
    });
  }, [violation]);

  useEffect(() => {
    setCategoryHandler();
  }, [setCategoryHandler]);

  const { mutate: Delete, isLoading: DeleteIsLoading } = useMutation((payload) => deleteViolation(payload), {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['get-all-violations']);
      toast.success('Deleted successfully.');
      handleClose();
    },
    onError: (data) => {
      toast.error('Failed to delete.');
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      violation_categories_id: data.categoryId,
      violation_name: data.violation,
      penalty: data.penalty,
      description: data.description
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
            <RHFTextField name="categoryId" label="Category" inputType="dropDown" dropDownData={categoryList} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="violation" label="Violation" />
            <RHFTextField name="penalty" label="Penalty Amount" placeholder="P" type="number" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="description" label="Description" inputType="textarea" minRows={6} />
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
            <RHFTextField name="categoryId" label="Category" inputType="dropDown" dropDownData={categoryList} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="violation" label="Violation" />
            <RHFTextField name="penalty" label="Penalty Amount" placeholder="P" type="number" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="description" label="Description" inputType="textarea" minRows={6} />
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
          Are you sure you want to delete this violation?
        </Typography>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'flex-end', mt: 7 }}>
          <Button variant="text" onClick={() => handleClose()}>
            Cancel
          </Button>
          <LoadingButton variant="outlined" color="error" loading={isLoading} onClick = {() => {Delete(violation.id)}}>
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
