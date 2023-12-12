import { useState, useMemo, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import _ from 'lodash';
import { toast } from 'react-toastify';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, RHFTextField } from '../hook-form';
import listOfBarangay from '../../utils/listOfBarangay.json'

// schema
import { citationPlaceAndDateSchema } from '../../yup-schema/citationPlaceAndDateSchema';

import { setPlaceAndDate } from '../../store/CitationSlice';


// ----------------------------------------------------------------------

export default function PlaceAndDateComponent() {
  const dispatch = useDispatch();
  const { placeAndDate } = useSelector((store) => store.citation);

  const barangayObjects = listOfBarangay.map((barangay) => ({
    value: barangay.toLowerCase().replace(/\s/g, '_'),
    label: barangay,
  }));

  const defaultValues = {
    tct: '',
    violationDate: new Date(),
    violationTime: new Date(),
    street: '',
    barangay: 'Awang',
    municipality: 'Opol',
    zipcode: '9016'
  };

  const methods = useForm({
    resolver: yupResolver(citationPlaceAndDateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if(!_.isEmpty(placeAndDate)) {
      reset({
        tct: placeAndDate.tct,
        violationDate: placeAndDate.violationDate,
        violationTime: placeAndDate.violationTime,
        street: placeAndDate.street,
        barangay: 'Awang',
        municipality: 'Opol',
        zipcode: '9016'
      })
    }
  }, [placeAndDate, reset])


  const onSubmit = async (data) => {
    await dispatch(setPlaceAndDate(data))
    toast.success('Saved Locally')
    // console.log(moment.utc(data.violationTime).local().format('LT'))
  
  };  

  return (
    <Container sx={{marginTop: 5}}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="tct" label="TCT No." />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="violationDate" label="Violation Date" inputType="datePicker" />
            <RHFTextField name="violationTime" label="Violation Time" inputType="datePicker" time />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="street" label="Street" />
            <RHFTextField name="barangay" label="Barangay" inputType="dropDown" dropDownData={barangayObjects} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="municipality" label="Municipality" defaultValues="Opol" disabled/>
            <RHFTextField name="zipcode" label="Zipcode" defaultValues="9016" disabled/>
          </Stack>

          <Stack direction="row" spacing={4}>
            <Box width="100%">
              <LoadingButton fullWidth size="large" variant="contained" type="submit">
                Save
              </LoadingButton>
            </Box>
          </Stack>
        </Stack>
      </FormProvider>
    </Container>
  );
}
