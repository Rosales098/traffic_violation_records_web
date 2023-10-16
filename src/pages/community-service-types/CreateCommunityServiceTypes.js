import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Tooltip, IconButton, Stack, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { RHFTextField, FormProvider } from '../../components/hook-form';
import CreateUserForm from '../../components/user/CreateUserForm';
import { ServiceTypeSchema } from '../../yup-schema/serviceTypeSchema';
// api
import communityServiceTypesApi from '../../service/communityServiceTypesApi';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '60%',
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  marginTop: -50,
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function CreateServiceTypes() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {createCommunityServicesTypes} = communityServiceTypesApi;

  const defaultValues = {
    serviceName: '',
    discount: '500',
    timeToRender: '8'
  };

  const methods = useForm({
    resolver: yupResolver(ServiceTypeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: Create, isLoading: isLoad } = useMutation((payload) => createCommunityServicesTypes(payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-all-service-types']);
      toast.success('Created successfully');
      setIsLoading(true);
      navigate(-1);
    },
    onError: (data) => {
      console.log(data);
      toast.error(data.response.data.message);
      setIsLoading(false);
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      service_name: data.serviceName,
      discount: data.discount,
      time_to_render: data.timeToRender,
    };
    await Create(payload);
  };


  return (
    <Page title="Community Service Types">
        <Container>
          <ContentStyle>
            <div style={{ padding: 5, zIndex: 9999 }}>
              <Tooltip title="View">
                <IconButton onClick={() => navigate(-1)}>
                  <Iconify icon="ion:arrow-back-circle" sx={{ width: 30, height: 30 }} />
                </IconButton>
              </Tooltip>
              <Typography variant="h4" gutterBottom sx={{ mb: 2, alignSelf: 'flex-end' }}>
                Creating Community Service
              </Typography>
            </div>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack direction={{ xs: 'column' }} spacing={2}>
                <RHFTextField name="serviceName" label="Service Name" />
                <RHFTextField name="discount" label="Discount(₱)" disabled/>
                <RHFTextField name="timeToRender" label="Time to Render(hours)" disabled/>
              </Stack>
              <Stack direction="row" spacing={4} sx={{marginTop: 10}}>
                <Box width="100%">
                  <LoadingButton fullWidth size="large" variant="contained" loading={isLoading} type="submit">
                    Create
                  </LoadingButton>
                </Box>
              </Stack>
            </FormProvider>
          </ContentStyle>
        </Container>

    </Page>
  );
}
