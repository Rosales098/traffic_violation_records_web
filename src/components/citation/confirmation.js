import { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

// @mui
import { Stack, IconButton, InputAdornment, Box, Card, Container, Typography, Grid, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import CitationApi from '../../service/CitationApi';
import {
  setViolator,
  removeViolations,
  setPlaceAndDate,
  setRegistered,
  setLicense,
  setVehicle,
  setWithLicense,
  setWithPlate,
} from '../../store/CitationSlice';

// ----------------------------------------------------------------------

export default function Confirmation() {
  const { createCitation } = CitationApi;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { violations, violator, license, vehicle, placeAndDate, withLicense, withPlate, registered } = useSelector(
    (store) => store.citation
  );
  const [totalAmount, setTotalAmount] = useState(null);
  const [violationIds, setViolationIds] = useState(null);

  const getSubTotal = useCallback(() => {
    let subTotal = 0;
    const ids = [];
    if (!_.isEmpty(violations)) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < violations?.length; i++) {
        ids.push(violations[i].id);
        subTotal += parseInt(violations[i]?.penalty, 10);
      }
    }
    setViolationIds(ids);
    setTotalAmount(subTotal);
  }, [violations]);

  useEffect(() => {
    getSubTotal();
  }, [getSubTotal]);

  const { mutate: Create, isLoading: isLoad } = useMutation((payload) => createCitation(payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-all-citations']);
      toast.success('Created successfully');
      setIsLoading(false);
      dispatch(setViolator({}));
      dispatch(removeViolations());
      dispatch(setPlaceAndDate({}));
      dispatch(setLicense({}));
      dispatch(setVehicle({}));
      dispatch(setWithLicense(true));
      dispatch(setWithPlate(true));
      dispatch(setRegistered(true));
      navigate('/violations-records/unpaid')
    },
    onError: (data) => {
      console.log(data);
      toast.error(data.response.data.message);
      setIsLoading(false);
    },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const payload = {
      first_name: violator.firstName,
      middle_name: violator.middleName,
      last_name: violator.lastName,
      gender: violator.gender,
      //   address: violator.address,
      violatorMunicipality: violator.municipality,
      violatorZipcode: violator.zipcode,
      violatorBarangay: violator.barangay,
      violatorStreet: violator.street,
      nationality: violator.nationality,
      phone_number: violator.phoneNumber,
      dob: moment(violator.dob).format('MM-DD-YYYY'),
      license_number: withLicense ? license.licenseNumber : null,
      license_type: withLicense ? license.licenseType : 'N/A',
      license_status: withLicense ? license.licenseStatus : 'N/A',
      plate_number: withPlate ? vehicle.plateNumber : null,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      class: vehicle.class || 'N/A',
      body_markings: vehicle.bodyMarkings || 'N/A',
      registered_owner: vehicle.registeredOwner,
      owner_address: vehicle.ownerAddress || 'N/A',
      vehicle_status: vehicle.vehicleStatus,
      violations: `[${violationIds}]`,
      tct: placeAndDate.tct,
      date_of_violation: moment(placeAndDate?.violationDate).format('YYYY-MM-DD'),
      time_of_violation: placeAndDate.violationTime,
      municipality: placeAndDate.municipality,
      zipcode: placeAndDate.zipcode,
      barangay: placeAndDate.barangay,
      street: placeAndDate.street,
      sub_total: totalAmount,
    };
    console.log(payload);
    await Create(payload);
  };
  console.log(violationIds);

  return (
    <Container sx={{ marginTop: 5 }}>
      <Box>
        <Typography sx={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Violations</Typography>
        <Box sx={{ borderRadius: 2, display: 'grid' }}>
          {violations.map((data, index) => {
            return <Typography>{`${data?.violation_name} - ₱${data?.penalty}\n`}</Typography>;
          })}
          {/* {violations.map((data) => (
            <Typography sx={{ fontSize: 18 }}>{data.violation_name}</Typography>
          ))} */}
        </Box>
        <Typography sx={{ fontSize: 18, marginTop: 1 }}>{`Sub-total: ₱${totalAmount}`}</Typography>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Violator</Typography>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Name:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Gender:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Phone Number:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Date of Birth:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Nationality:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Street:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Barangay:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Municipality:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Zip Code:</Typography>
            </Box>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {`${violator.firstName || 'N/A'} ${violator.middleName || 'N/A'} ${violator.lastName || 'N/A'}`}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {violator.gender || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {violator.phoneNumber || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {moment(violator.dob).format('LL') || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {violator.nationality || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {violator.street || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {violator.barangay || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {violator.municipality || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {violator.zipcode || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>License Information</Typography>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>License Number:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>License Type:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Status:</Typography>
            </Box>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {license.licenseNumber || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {license.licenseType || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {license.licenseStatus || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Vehicle Information</Typography>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Plate Number:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Make:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Model:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Color:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Class:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Body Markins:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Registered Owner:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Owner Address:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Status:</Typography>
            </Box>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.plateNumber || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.make || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.model || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.color || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.class || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.bodyMarkings || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.registeredOwner || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.ownerAddress || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {vehicle.status || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Place and Date/Time</Typography>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>TCT #:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Violation Date:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Violation Time:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Street:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Barangay:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Municipality:</Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18 }}>Zip Code:</Typography>
            </Box>
            <Box>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {placeAndDate.tct || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {moment(placeAndDate.violationDate).format('LL') || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {moment.utc(placeAndDate.violationTime).local().format('LT') || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {placeAndDate.street || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {placeAndDate.barangay || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {placeAndDate.municipality || 'N/A'}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold' }}>
                {placeAndDate.zipcode || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
           
          </Stack> */}

      <Stack direction="row" spacing={4} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <Box width="20%">
          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            type="button"
            onClick={onSubmit}
            loading={isLoading}
            disabled={
              _.isEmpty(violations) ||
              _.isEmpty(violator) ||
              _.isEmpty(license) ||
              _.isEmpty(vehicle) ||
              _.isEmpty(placeAndDate)
            }
          >
            Save
          </LoadingButton>
        </Box>
      </Stack>
    </Container>
  );
}
