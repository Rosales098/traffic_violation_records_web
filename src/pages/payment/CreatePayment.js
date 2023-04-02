import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import Swal from 'sweetalert2';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Typography, Tooltip, IconButton, Stack, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { RHFTextField, FormProvider } from '../../components/hook-form';
import { PaymentRecordSchema } from '../../yup-schema/paymentRecordSchema';
import DialogModal from '../../components/dialog-modal/DialogModal';
// api
import paymentApi from '../../service/paymentApi';
import InvoiceList from './InvoiceList';

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

export default function CreatePayments() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createPayment } = paymentApi;
  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const defaultValues = {
    payee: '',
    subTotal: '',
    discount: '',
    totalAmount: '',
    totalPaid: '',
    paymentMethod: 'cash',
    paymentDate: new Date(),
    remarks: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentRecordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  useEffect(() => {
    if (!_.isEmpty(invoiceData)) {
      setValue(
        'payee',
        `${invoiceData?.citation?.violator?.last_name}, ${invoiceData?.citation?.violator?.first_name} ${invoiceData?.citation?.violator?.middle_name}`
      );
      setValue('subTotal', `₱${invoiceData.sub_total}`);
      setValue('discount', `${invoiceData.discount}%`);
      setValue('totalAmount', `₱${invoiceData.total_amount}`);
    }
  }, [invoiceData, setValue]);

  const { mutate: Create, isLoading: isLoad } = useMutation((payload) => createPayment(payload), {
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You are marking this invoice as PAID. You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const payload = {
          invoice_id: invoiceData.id,
          payment_date: moment(data.paymentDate).format('YYYY-MM-DD'),
          payment_method: data.paymentMethod,
          total_paid: invoiceData.total_amount,
          remarks: data.remarks,
        };
        await Create(payload);
      }
    });
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
              Creating Payment Record
            </Typography>
          </div>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="payee" label="Payee" disabled />
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
              <RHFTextField name="subTotal" label="Sub Total" disabled />
              <RHFTextField name="discount" label="Discount" disabled />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: 2 }}>
              <RHFTextField name="totalAmount" label="Total Amount" disabled />
            </Stack>
            <Stack direction={{ xs: 'column' }} spacing={2} sx={{ marginTop: 2 }}>
              <RHFTextField
                name="paymentMethod"
                label="Payment Method"
                inputType="dropDown"
                dropDownData={[
                  { id: 1, value: 'cash', label: 'Cash' },
                  { id: 2, value: 'bank', label: 'Bank Transfer' },
                ]}
              />
              <RHFTextField name="paymentDate" label="Payment Date" inputType="datePicker" />
            </Stack>
            <Stack direction={{ xs: 'column' }} spacing={2} sx={{ marginTop: 2 }}>
              <RHFTextField name="remarks" label="Remarks" />
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginTop: 10 }}>
              <Box width="100%">
                <LoadingButton fullWidth size="large" variant="contained" loading={isLoading} type="submit">
                  Paid
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </ContentStyle>
      </Container>

      <DialogModal open={open} handleClose={handleClose} buttons width="xl">
        <InvoiceList setInvoiceData={setInvoiceData} handleClose={handleClose} />
      </DialogModal>
    </Page>
  );
}
