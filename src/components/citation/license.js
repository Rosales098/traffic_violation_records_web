import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { toast } from 'react-toastify';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import { FormProvider, RHFTextField } from '../hook-form';

// schema
import { setLicense, setWithLicense } from '../../store/CitationSlice';
import { licenseSchema } from '../../yup-schema/licenseInfoSchema';



// ----------------------------------------------------------------------
const licenseType = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Non-professional', label: 'Non-professional' },
  { value: 'Student-Permit', label: 'Student-Permit' },
];

const status = [
  { value: 'Unexpired', label: 'Unexpired' },
  { value: 'Expired', label: 'Expired' },
];
export default function CreateLicense() {
  const dispatch = useDispatch();
  const { license, withLicense } = useSelector((store) => store.citation);
  console.log(license)
  console.log(withLicense)
  const defaultValues = {
    licenseNumber: '',
    licenseType: 'Professional',
    licenseStatus: 'Unexpired',
  };

  const methods = useForm({
    resolver: yupResolver(licenseSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if(!_.isEmpty(license)) {
      reset({
        licenseNumber: license.licenseNumber,
        licenseType: license.licenseType,
        licenseStatus: license.licenseStatus,
      })
    }
  }, [license, reset])

  const onSubmit = async (data) => {
    console.log(data);
    dispatch(setLicense(data))
    toast.success('Saved Locally')
  };

  return (
    <Container sx={{ marginTop: 5 }} maxWidth="md">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <FormControl sx={{ marginBottom: 2 }}>
          {/* <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel> */}
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="withLicense"
            value={withLicense ? "withLicense" : "withoutLicense"}
            onChange={(e) => dispatch(setWithLicense(e.target.value === 'withLicense'))}
          >
            <FormControlLabel value="withLicense" control={<Radio />} label="With License #" />
            <FormControlLabel value="withoutLicense" control={<Radio />} label="Without License #" />
          </RadioGroup>
        </FormControl>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="licenseNumber" label="LicenseNumber" disabled={!withLicense} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="licenseType" label="License Type" inputType="dropDown" dropDownData={licenseType} disabled={!withLicense} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="licenseStatus" label="Status" inputType="dropDown" dropDownData={status} disabled={!withLicense} />
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
