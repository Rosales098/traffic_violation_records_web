import { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card, Container, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';

import nationalityList from '../../utils/nationalityList.json';
// components
import { FormProvider, RHFTextField } from '../hook-form';

// schema
import { setViolator, setLicense, setVehicles, setWithLicense, setSelectedViolator } from '../../store/CitationSlice';
import { violatorSchema } from '../../yup-schema/violatorSchema';

import violatorApi from '../../service/violatorApi';

// ----------------------------------------------------------------------
const genderData = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function CreateViolator() {
  const dispatch = useDispatch();
  const { getAllViolators } = violatorApi;
  const [violatorList, setViolatorList] = useState([]);
  const { violator, selectedViolator } = useSelector((store) => store.citation);

  console.log(violator);

  const {
    data: violatorData,
    status: violatorStatus,
    // isFetching: makeIsFetching,
  } = useQuery(['get-all-violator'], () => getAllViolators(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (violatorStatus === 'success') {
      setViolatorList(
        violatorData.data.map((data) => ({
          label: `${data.first_name} ${data.middle_name} ${data.last_name}`,
          value: data.id,
        }))
      );
    }
  }, [violatorData?.data, violatorStatus]);

  const nationalityObjects = nationalityList.map((nationality) => ({
    value: nationality.toLowerCase().replace(/\s/g, '_'),
    label: nationality,
  }));

  const defaultValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'male',
    phoneNumber: '',
    dob: new Date(),
    nationality: 'afghan',
    street: '',
    barangay: '',
    municipality: '',
    zipcode: '',
  };

  const methods = useForm({
    resolver: yupResolver(violatorSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSelectViolator = (id) => {
    dispatch(setSelectedViolator(id))
    // eslint-disable-next-line eqeqeq
    const obj = violatorData?.data?.find((item) => item.id == id);
    console.log(obj);
    dispatch(
      setViolator({
        firstName: obj.first_name,
        middleName: obj.middle_name,
        lastName: obj.last_name,
        gender: obj.gender,
        phoneNumber: obj.phone_number,
        dob: obj.dob,
        nationality: obj.nationality,
        street: obj.street,
        barangay: obj.barangay,
        municipality: obj.municipality,
        zipcode: obj.zipcode,
      })
    );
    dispatch(
      setLicense({
        licenseNumber: obj.license.license_number,
        licenseType: obj.license.license_type,
        licenseStatus: obj.license.license_status,
      })
    );
    dispatch(setWithLicense(obj.license.license_number !== null))
    dispatch(setVehicles(obj.vehicle));
  };

  useEffect(() => {
    if (!_.isEmpty(violator)) {
      reset({
        firstName: violator.firstName,
        middleName: violator.middleName,
        lastName: violator.lastName,
        gender: violator.gender,
        phoneNumber: violator.phoneNumber,
        dob: violator.dob,
        nationality: violator.nationality,
        street: violator.street,
        barangay: violator.barangay,
        municipality: violator.municipality,
        zipcode: violator.zipcode,
      });
    }
  }, [reset, violator]);

  const onSubmit = async (data) => {
    await dispatch(setViolator(data));
    toast.success('Saved Locally');
  };

  return (
    <Container sx={{ marginTop: 5 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              select
              SelectProps={{ native: true }}
              variant="outlined"
              value={selectedViolator}
              onChange={(event) => {
                onSelectViolator(event.target.value);
              }}
            >
              <option key={0} value={0}>
                {'Select Violator'}
              </option>
              {violatorList.map((option, key) => (
                <option key={key} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="firstName" label="First name" />
            <RHFTextField name="middleName" label="Middle name" />
            <RHFTextField name="lastName" label="Last name" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="gender" label="Gender" inputType="dropDown" dropDownData={genderData} />
            <RHFTextField name="phoneNumber" label="Phone Number" type="number" />
            <RHFTextField name="dob" label="Date of Birth" inputType="datePicker" />
            <RHFTextField
              name="nationality"
              label="Nationality"
              inputType="dropDown"
              dropDownData={nationalityObjects}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="street" label="Street" />
            <RHFTextField name="barangay" label="Barangay" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="municipality" label="Municipality" />
            <RHFTextField name="zipcode" label="Zipcode" />
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
