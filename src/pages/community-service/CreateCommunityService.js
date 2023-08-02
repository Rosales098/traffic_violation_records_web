/* eslint-disable eqeqeq */
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Tooltip, IconButton, Stack, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import _ from 'lodash';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { RHFTextField, FormProvider } from '../../components/hook-form';
import CreateUserForm from '../../components/user/CreateUserForm';
import { CommunityServiceSchema } from '../../yup-schema/communityServiceSchema';
import DialogModal from '../../components/dialog-modal/DialogModal';
import CitationList from './CitationList';
// api
import communityServiceTypesApi from '../../service/communityServiceTypesApi';
import communityServicesApi from '../../service/communityServicesApi';

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

export default function CreateCommunityService() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { getAllCommunityServicesTypes } = communityServiceTypesApi;
  const { createCommunityServices } = communityServicesApi;

  const [servicesList, setServicesList] = useState([]);
  const [open, setOpen] = useState(false);
  const [citationData, setCitationData] = useState([]);
  const [serviceId, setServiceId] = useState([]);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data: servicesData,
    status: setServicesListStatus,
    isFetching: setServicesListIsFetching,
  } = useQuery(['get-all-service-types'], () => getAllCommunityServicesTypes(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (setServicesListStatus === 'success') {
      setServicesList(
        servicesData.data.map((data) => ({
          id: data.id,
          value: data.id,
          label: data.service_name,
        }))
      );
    }
    setServiceId(servicesData?.data[0].id);
  }, [setServicesListStatus, servicesData]);

  const defaultValues = {
    citation: '',
    serviceTypeId: '',
    renderedTime: '',
    discount: '',
    timeToRender: '',
    status: 'unsettled',
  };

  const methods = useForm({
    resolver: yupResolver(CommunityServiceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  useEffect(() => {
    if (servicesData?.data?.length > 0) {
      setServiceId(servicesData?.data[0]?.id);
      setValue('serviceTypeId', servicesData?.data[0]?.id);
      setValue('discount', `${servicesData?.data[0]?.discount}%`);
      setValue('timeToRender', `${servicesData?.data[0]?.time_to_render} hours`);
    }
  }, [servicesData, setValue]);

  useEffect(() => {
    const data = servicesData?.data?.filter((x) => x.id == serviceId);
    setValue('serviceTypeId', data[0]?.id);
    setValue('discount', `${data[0]?.discount}%`);
    setValue('timeToRender', `${data[0]?.time_to_render} hours`);
  }, [serviceId, servicesData?.data, setValue]);

  useEffect(() => {
    if (!_.isEmpty(citationData)) {
      setValue(
        'citation',
        `${citationData?.violator?.last_name}, ${citationData?.violator?.first_name} ${citationData?.violator?.middle_name}`
      );
    }
  }, [citationData, setValue]);

  const { mutate: Create, isLoading: isLoad } = useMutation((payload) => createCommunityServices(payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-community-services']);
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
    const serviceData = servicesData.data.filter((x) => x.id == serviceId)
    if (parseInt(serviceData[0]?.time_to_render, 10) < parseInt(data.renderedTime, 10)) {
      return toast.error(
        'Invalid User Input. Please make sure Rendered Time is not greater than Time to Render value.'
      );
    }

    if (
      (parseInt(serviceData[0]?.time_to_render, 10) > parseInt(data.renderedTime, 10) &&
        data.status === 'settled') ||
      parseInt(serviceData[0]?.time_to_render, 10) == parseInt(data.renderedTime, 10)
    ) {
      Swal.fire({
        title: 'Are you sure?',
        text:
          parseInt(serviceData[0]?.time_to_render, 10) > parseInt(data.renderedTime, 10) &&
          data.status === 'settled'
            ? "You set status to Settled even Rendered Time did not make the required hours. This will automatically set Community Service Settled and discount the Invoice. You won't be able to revert this."
            : "You entered Rendered Time as equal to Time To Render. This will automatically set Community Service Settled and discount the Invoice. You won't be able to revert this.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);
          const payload = {
            citation_id: citationData?.id,
            invoice_id: citationData?.invoice?.id,
            community_service_details_id: data.serviceTypeId,
            rendered_time: data.renderedTime,
            status:
              parseInt(serviceData[0]?.time_to_render, 10) == parseInt(data.renderedTime, 10)
                ? 'settled'
                : data.status,
          };
          await Create(payload);
        }
      });
    } else {
      setIsLoading(true);
      const payload = {
        citation_id: citationData?.id,
        invoice_id: citationData?.invoice?.id,
        community_service_details_id: data.serviceTypeId,
        rendered_time: data.renderedTime,
        status:
          parseInt(serviceData[0]?.time_to_render, 10) == parseInt(data.renderedTime, 10)
            ? 'settled'
            : data.status,
      };
      await Create(payload);
    }
  };

  return (
    <Page title="Community Service Types">
      <Container maxWidth="xl">
        <ContentStyle>
          <div style={{ padding: 5, zIndex: 1 }}>
            <Tooltip title="View">
              <IconButton onClick={() => navigate(-1)}>
                <Iconify icon="ion:arrow-back-circle" sx={{ width: 30, height: 30 }} />
              </IconButton>
            </Tooltip>
            <Typography variant="h4" sx={{ mb: 2, alignSelf: 'flex-end' }}>
              Creating Community Service
            </Typography>
          </div>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="citation" label="Violator" disabled />
              <Button
                variant="outlined"
                onClick={() => {
                  openDialog();
                }}
                sx={{ height: 55 }}
              >
                Select
              </Button>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: 2 }}>
              <RHFTextField
                name="serviceTypeId"
                label="Service Name"
                inputType="dropDown"
                dropDownData={servicesList}
                setServiceId={setServiceId}
              />
              <RHFTextField name="discount" label="Discount" disabled style={{ width: 200 }} />
              <RHFTextField name="timeToRender" label="Time To Render" disabled style={{ width: 200 }} />
            </Stack>
            <Stack direction={{ xs: 'column' }} spacing={2} sx={{ marginTop: 2 }}>
              <RHFTextField name="renderedTime" label="Rendered Time(hours)" />
              <RHFTextField
                name="status"
                label="Status"
                inputType="dropDown"
                dropDownData={[
                  { id: 1, value: 'unsettled', label: 'Unsettled' },
                  { id: 2, value: 'settled', label: 'Settled' },
                ]}
              />
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginTop: 10 }}>
              <Box width="100%">
                <LoadingButton fullWidth size="large" variant="contained" loading={isLoading} type="submit">
                  Create
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </ContentStyle>
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        // eslint-disable-next-line no-nested-ternary
        // title={"Selecting Violator"}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
        width="xl"
      >
        <CitationList setCitationData={setCitationData} handleClose={handleClose} />
      </DialogModal>
    </Page>
  );
}
