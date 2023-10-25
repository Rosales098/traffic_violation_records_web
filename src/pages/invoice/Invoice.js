/* eslint-disable no-nested-ternary */
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// material
import { Container, Typography, Stack, Button, Tooltip, IconButton, Dialog, capitalize } from '@mui/material';

// components
import Iconify from '../../components/Iconify';
import Page from '../../components/Page';
import AppTable from '../../components/table/AppTable';
import DialogModal from '../../components/dialog-modal/DialogModal';
import ViolationCategoriesApi from '../../service/ViolationCategoriesApi';
import invoiceApi from '../../service/invoiceApi';
import ViolationsApi from '../../service/ViolationsApi';
import InvoiceDetails from './InvoiceDetails';

// ----------------------------------------------------------------------

export default function Invoice() {
  const { getAllInvoices, viewInvoice } = invoiceApi;
  const { getViolations } = ViolationsApi;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [violationsList, setViolationsList] = useState([]);

  const [invoiceDetailsData, setInvoiceDetailsData] = useState({});

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data: invoiceData,
    status: invoiceStatus,
    isFetching: invoiceIsFetching,
  } = useQuery(['get-all-invoices'], () => getAllInvoices(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const {
    data: violationsData,
    status: violationsStatus,
    isFetching: violationsIsFetching,
  } = useQuery(['get-all-violations'], () => getViolations(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (violationsStatus === 'success') {
      setViolationsList(violationsData.data);
    }
  }, [violationsData, violationsStatus]);
  console.log(invoiceData);
  useEffect(() => {
    if (invoiceStatus === 'success') {
      setInvoiceList(
        invoiceData?.data?.map((data) => ({
          tobeSearch: `${data?.citation?.violator?.last_name} ${data?.citation?.violator?.first_name} ${data?.citation?.violator?.middle_name}`,
          id: <span>{`#${data.citation.tct}`}</span>,
          date: data.date,
          violations: (
            <>
              {violationsList?.map((violations, index) => {
                if (data?.violations?.some((user) => user.id === violations.id)) {
                  return `${violations?.violation_name} - ₱${violations?.penalty}\n`;
                }
                return '';
              })}
            </>
          ),
          subTotal: `₱${data.sub_total}`,
          discount: `₱500`,
          totalAmount: `₱${data.total_amount}`,
          violator: `${capitalize(data?.citation?.violator?.last_name)}, ${capitalize(
            data?.citation?.violator?.first_name
          )} ${capitalize(data?.citation?.violator?.middle_name)}`,
          status: (
            <span
              style={{
                fontWeight: 'bold',
                color: data?.status === 'paid' ? 'green' : data?.status === 'unpaid' ? 'red' : 'blue',
              }}
            >
              {`${data?.status.toUpperCase()}`}
            </span>
          ),
          action: (
            <>
              <Tooltip title="View">
                <IconButton
                  onClick={async () => {
                    setInvoiceDetailsData(data);
                    openDialog();
                  }}
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
            </>
          ),
        }))
      );
    }
  }, [invoiceStatus, invoiceData?.data, dispatch, violationsList]);

  return (
    <Page title="Invoices">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={'Invoices'}
          hasButton={false}
          buttonFunction={() => {
            openDialog();
          }}
          TABLE_HEAD={[
            { id: 'id', label: 'Ticket #', align: 'center' },
            { id: 'date', label: 'Date', align: 'center' },
            { id: 'violator', label: 'Violator', align: 'center' },
            { id: 'violations', label: 'Violations', align: 'center' },
            { id: 'subTotal', label: 'Sub Amount', align: 'center' },
            { id: 'discount', label: 'Discount', align: 'center' },
            { id: 'totalAmount', label: 'Total Amount', align: 'center' },
            { id: 'status', label: 'Status', align: 'center' },
            { id: 'action', label: 'Action', align: 'center' },
          ]}
          searchTitle="Search Full Name..."
          TABLE_DATA={invoiceList}
        />
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={'md'}
      >
        <InvoiceDetails invoiceDetailsData={invoiceDetailsData} />
      </Dialog>
    </Page>
  );
}
