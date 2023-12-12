import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import moment from 'moment/moment';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
// @mui
import { Stack, IconButton, InputAdornment, Box, Card, Container, TextField, capitalize } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import _ from 'lodash';

import { FormProvider, RHFTextField } from '../hook-form';

import vehicleApi from '../../service/vehicleApi';

import { setWithPlate, setRegistered, setVehicle } from '../../store/CitationSlice';
import { vehicleSchema } from '../../yup-schema/vehicleSchema';

// ----------------------------------------------------------------------
const vehicleStatus = [
  { value: 'Unexpired', label: 'Unexpired' },
  { value: 'Expired', label: 'Expired' },
];

export default function VehicleComponent() {
  const dispatch = useDispatch();
  const { getMake, getClass } = vehicleApi;
  const [isLoading, setIsLoading] = useState(false);
  const [makeList, setMakeList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { withPlate, registered, vehicle, vehicles } = useSelector((store) => store.citation);

  const {
    data: makeData,
    status: makeStatus,
    isFetching: makeIsFetching,
  } = useQuery(['get-all-make'], () => getMake(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (makeStatus === 'success') {
      setMakeList(
        makeData.data.map((data) => ({
          label: data.make,
          value: data.make,
        }))
      );
    }
    setMakeList((oldArray) => [{ label: 'Select', value: 'select' }, ...oldArray]);
  }, [makeData?.data, makeStatus]);

  const {
    data: classData,
    status: classStatus,
    isFetching: categoryIsFetching,
  } = useQuery(['get-all-class'], () => getClass(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (classStatus === 'success') {
      setClassList(
        classData.data.map((data) => ({
          label: data.class,
          value: data.class,
        }))
      );
    }
    setClassList((oldArray) => [{ label: 'Select', value: 'select' }, ...oldArray]);
  }, [classData?.data, classStatus]);

  useEffect(() => {
    if (!_.isEmpty(vehicles)) {
      setVehicleList(
        vehicles.map((data) => ({
          label: `${data.class} ${data.make} ${capitalize(data.model)} ${capitalize(data.color)}, Plate #:${
            data.plate_number || 'N/A'
          }`,
          value: data.id,
        }))
      );
    }
  }, [vehicles]);

  const onSelectVehicle = (id) => {
    setSelectedVehicle(id);
    // eslint-disable-next-line eqeqeq
    const obj = vehicles?.find((item) => item.id == id);
    dispatch(
      setVehicle({
        plateNumber: obj.plate_number,
        make: obj.make,
        model: obj.model,
        color: obj.color,
        class: obj.class,
        registeredOwner: obj.registered_owner,
        ownerAddress: obj.owner_address,
        vehicleStatus: obj.vehicle_status,
      })
    );
    dispatch(setWithPlate(obj.plate_number !== null))
    dispatch(setRegistered(obj.registered_owner !== 'N/A'))
  };

  const defaultValues = {
    plateNumber: '',
    make: 'select',
    model: '',
    color: '',
    class: 'select',
    registeredOwner: '',
    ownerAddress: '',
    vehicleStatus: 'Unexpired',
  };

  const methods = useForm({
    resolver: yupResolver(vehicleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!_.isEmpty(vehicle)) {
      reset({
        plateNumber: vehicle.plateNumber,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        class: vehicle.class,
        registeredOwner: vehicle.registeredOwner,
        ownerAddress: vehicle.ownerAddress,
        vehicleStatus: vehicle.vehicleStatus,
      });
    }
  }, [reset, vehicle]);

  const onSubmit = async (data) => {
    if (data.vehicleStatus === 'select') {
      toast.error('Invalid STATUS');
      return;
    }
    if (data.make === 'select') {
      toast.error('Invalid MAKE');
      return;
    }
    if (data.class === 'select') {
      toast.error('Invalid CLASS');
      return;
    }
    toast.success('Saved Locally');
    await dispatch(setVehicle(data));
  };

  return (
    <Container sx={{ marginTop: 5 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            select
            SelectProps={{ native: true }}
            variant="outlined"
            value={selectedVehicle}
            onChange={(event) => {
              onSelectVehicle(event.target.value);
            }}
          >
            <option key={0} value={0}>
              {'Select Vehicle'}
            </option>
            {vehicleList.map((option, key) => (
              <option key={key} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Stack>
        <FormControl sx={{ marginBottom: 2 }}>
          {/* <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel> */}
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="plateStatus"
            value={withPlate ? 'withPlate' : 'withoutPlate'}
            onChange={(e) => {
              dispatch(setWithPlate(e.target.value === 'withPlate'));
            }}
          >
            <FormControlLabel
              value="withPlate"
              control={<Radio />}
              label="With Plate #"
              onClick={() => setValue('plateNumber', '')}
            />
            <FormControlLabel
              value="withoutPlate"
              control={<Radio />}
              label="Without Plate #"
              onClick={() => setValue('plateNumber', 'N/A')}
            />
          </RadioGroup>
        </FormControl>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="plateNumber" label="Plate Number" disabled={!withPlate} />
            <RHFTextField
              name="vehicleStatus"
              label="Vehicle Status"
              inputType="dropDown"
              dropDownData={vehicleStatus}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="make" label="Make" inputType="dropDown" dropDownData={makeList} />
            <RHFTextField name="model" label="Model" />
            <RHFTextField name="color" label="Color" />
            <RHFTextField name="class" label="Class" inputType="dropDown" dropDownData={classList} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="bodyMarkings" label="Body Markings" />
          </Stack>

          <FormControl sx={{ marginBottom: 2 }}>
            {/* <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel> */}
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="vehicleRegistration"
              value={registered ? 'registered' : 'unregistered'}
              onChange={(e) => dispatch(setRegistered(e.target.value === 'registered'))}
            >
              <FormControlLabel
                value="registered"
                control={<Radio />}
                label="Registered"
                onClick={() => {
                  setValue('registeredOwner', '');
                  setValue('ownerAddress', '');
                }}
              />
              <FormControlLabel
                value="unregistered"
                control={<Radio />}
                label="Unregistered"
                onClick={() => {
                  setValue('registeredOwner', 'N/A');
                  setValue('ownerAddress', 'N/A');
                }}
              />
            </RadioGroup>
          </FormControl>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="registeredOwner" label="Registered Owner" disabled={!registered} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="ownerAddress" label="Owner Address" disabled={!registered} />
          </Stack>

          <Stack direction="row" spacing={4}>
            <Box width="100%">
              <LoadingButton fullWidth size="large" variant="contained" loading={isLoading} type="submit">
                Save
              </LoadingButton>
            </Box>
          </Stack>
        </Stack>
      </FormProvider>
    </Container>
  );
}
