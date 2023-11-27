/* eslint-disable no-nested-ternary */
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import moment from 'moment';

// material
import { Container, Tooltip, IconButton, Box } from '@mui/material';

// components
import Page from '../../components/Page';
import AppTable from '../../components/table/AppTable';
import Iconify from '../../components/Iconify';

// api
import CitationApi from '../../service/CitationApi';
import ViolationsApi from '../../service/ViolationsApi';
// ----------------------------------------------------------------------

export default function UnpaidCitationRecords() {
  const navigate = useNavigate();
  const { getViolations } = ViolationsApi;
  const { getAllCitations } = CitationApi;
  const [citationList, setCitationList] = useState([]);
  const [violationsList, setViolationsList] = useState([]);
  const [action, setAction] = useState('create');

  const {
    data: violationsData,
    status: violationsStatus,
    isFetching: violationsIsFetching,
  } = useQuery(['get-all-paid-violations'], () => getViolations(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (violationsStatus === 'success') {
      setViolationsList(violationsData.data);
    }
  }, [violationsData, violationsStatus]);

  const {
    data: citationData,
    status: citationStatus,
    isFetching: citationIsFetching,
  } = useQuery(['get-all-citations'], () => getAllCitations(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (citationStatus === 'success') {
      const newList = citationData.data.filter((item) => item?.invoice?.status === 'unpaid');
      setCitationList(
        newList.map((data) => ({
          action: (
            <Box sx={{ width: 100 }}>
              <Tooltip title="View">
                <IconButton
                // onClick={async () => {
                //   await dispatch(setCategory(data));
                //   openDialog();
                //   setAction('update');
                // }}
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              {/* <Tooltip
                title="Delete"
                onClick={() => {
                  // dispatch(setCategory(data));
                  // openDialog();
                  setAction('delete');
                }}
              >
                <IconButton>
                  <Iconify icon="bxs:trash" />
                </IconButton>
              </Tooltip> */}
            </Box>
          ),
          enforcer: (
            <span>
              {`${data.enforcer.first_name.toUpperCase()} ${data.enforcer.middle_name
                .charAt(0)
                .toUpperCase()}. ${data.enforcer.last_name.toUpperCase()}`}
            </span>
          ),
          id: <span>{`${data.tct}`}</span>,
          tobeSearch: data.tct,
          status: (
            <span
              style={{
                fontWeight: 'bold',
                color: data.invoice.status === 'paid' ? 'green' : data.invoice.status === 'unpaid' ? 'red' : 'blue',
              }}
            >
              {`${data.invoice.status.toUpperCase()}`}
            </span>
          ),
          settled: (
            <>
              <span
                style={{
                  fontWeight: 'bold',
                  color: 'red',
                }}
              >
                {`${data?.invoice?.expired?.toUpperCase()}`}
                <Tooltip title={data?.invoice?.expired === 'yes' ? "Expired, unsettled within 72 hours" : "Must settled within 72 hours"}>
                  <IconButton>
                    <Iconify icon={'mdi:information-outline'} width={25} height={25} color={'red'} />
                  </IconButton>
                </Tooltip>
              </span>
            </>
          ),
          violations: (
            <>
              {violationsList?.map((violations, index) => {
                if (data?.violations?.some((user) => user.id === violations.id)) {
                  return `${violations?.violation_name},\n`;
                }
                return '';
              })}
            </>
          ),
          totalAmount: <span style={{ fontWeight: 'bold' }}>{`₱${data.invoice.total_amount}`}</span>,
          date: data.date_of_violation,
          time: moment(data.time_of_violation).format('h:mm:ss A'),
          street: data.street.toUpperCase(),
          barangay: data.barangay.toUpperCase(),
          municipality: data.municipality.toUpperCase(),
          zipcode: data.zipcode,
          name: `${data.violator.last_name}, ${data.violator.first_name} ${data.violator.middle_name}`,
          address: data.violator.address,
          nationality: data.violator.nationality,
          phoneNumber: data.violator.phone_number,
          dob: moment(data.violator.dob).format('YYYY-MM-DD'),
          licenseNumber: data.license.license_number === '0' ? 'N/A' : data.license.license_number,
          type: data.license.license_number === '0' ? 'N/A' : data.license.license_type.toUpperCase(),
          licenseStatus: data.license.license_number === '0' ? 'N/A' : data.license.license_status.toUpperCase(),
          make: data?.vehicle?.make?.toUpperCase(),
          model: data?.vehicle?.model?.toUpperCase(),
          plate: data?.vehicle?.plate_number,
          color: data?.vehicle?.color?.toUpperCase(),
          class: data?.vehicle?.class || 'N/A',
          bodyMarkings: data?.vehicle?.body_markings || 'N/A',
          owner: data.vehicle?.registered_owner?.toUpperCase(),
          ownerAddress: data?.vehicle?.owner_address,
          vehicleStatus:
            data?.vehicle?.registered_owner?.toUpperCase() === 'NONE' ||
            data?.vehicle?.registered_owner?.toUpperCase() === 'N/A'
              ? 'N/A'
              : data?.vehicle?.vehicle_status?.toUpperCase(),
        }))
      );
    }
  }, [citationData, citationStatus]);

  return (
    <Page title="Violations Records">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={'Violations Records'}
          buttonTitle={'Add Violator'}
          hasButton={false}
          buttonFunction={() => navigate('create')}
          TABLE_HEAD={[
            // { id: 'action', label: 'Action', align: 'center' },
            { id: 'enforcer', label: 'Enforcer', align: 'center' },
            { id: 'id', label: 'Ticket #', align: 'center' },
            { id: 'name', label: 'Full Name', align: 'center' },
            // { id: 'violations', label: 'Violations', align: 'center' },
            // { id: 'totalAmount', label: 'Total Amount', align: 'center' },
            { id: 'date', label: 'Date', align: 'center' },
            // { id: 'time', label: 'Time', align: 'center' },
            // { id: 'street', label: 'Street', align: 'center' },
            // { id: 'barangay', label: 'Barangay', align: 'center' },
            // { id: 'municipality', label: 'Municipality', align: 'center' },
            // { id: 'zipcode', label: 'Zip Code', align: 'center' },
            // { id: 'address', label: 'Address', align: 'center' },
            // { id: 'nationality', label: 'Nationality', align: 'center' },
            // { id: 'phoneNumber', label: 'Phone Number', align: 'center' },
            // { id: 'dob', label: 'Date of Birth', align: 'center' },
            { id: 'licenseNumber', label: 'License Number', align: 'center' },
            { id: 'type', label: 'License Type', align: 'center' },
            { id: 'licenseStatus', label: 'License Status', align: 'center' },
            { id: 'make', label: 'Make', align: 'center' },
            { id: 'model', label: 'Model', align: 'center' },
            { id: 'plate', label: 'Plate Number', align: 'center' },
            // { id: 'color', label: 'Color', align: 'center' },
            // { id: 'class', label: 'Class', align: 'center' },
            // { id: 'bodyMarkings', label: 'Body Markings', align: 'center' },
            // { id: 'owner', label: 'Owner', align: 'center' },
            // { id: 'ownerAddress', label: 'Owner Address', align: 'center' },
            // { id: 'vehicleStatus', label: 'Vehicle Status', align: 'center' },
            { id: 'status', label: 'Payment Status', align: 'center' },
            { id: 'settled', label: 'Settled', align: 'center' },
          ]}
          searchTitle="Search Ticket #..."
          TABLE_DATA={citationList}
        />
      </Container>
    </Page>
  );
}
