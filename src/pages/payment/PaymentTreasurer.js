import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
// material
import { Container, Tooltip, IconButton, capitalize } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Page from '../../components/Page';

// mock
import AppTable from '../../components/table/AppTable';

// api
import paymentApi from '../../service/paymentApi';
// ----------------------------------------------------------------------

export default function PaymentsTreasurer() {
  const { getPaymentsUser } = paymentApi;
  const navigate = useNavigate();
  const [paymentList, setPaymentList] = useState([]);
  const { id } = useParams();

  const {
    data: paymentsData,
    status: paymentsStatus,
    isFetching: paymentIsFetching,
  } = useQuery(['get-payments-user'], () => getPaymentsUser(id), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });
  console.log(paymentsData);

  useEffect(() => {
    if (paymentsStatus === 'success') {
      setPaymentList(
        paymentsData.data.map((data) => ({
          tobeSearch: `${data?.invoice?.citation?.violator?.last_name} ${data?.invoice?.citation?.violator?.first_name} ${data?.invoice?.citation?.violator?.middle_name}`,
          id: data.id,
          violator: `${capitalize(data?.invoice?.citation?.violator?.last_name)}, ${capitalize(
            data?.invoice?.citation?.violator?.first_name
          )} ${capitalize(data?.invoice?.citation?.violator?.middle_name)}`,
          paymentDate: data.payment_date,
          paymentMethod: data.payment_method.toUpperCase(),
          subTotal: `₱${data.invoice.sub_total}`,
          discount: `₱${data.invoice.discount}`,
          totalAmount: `₱${data.invoice.total_amount}`,
          totalPaid: `₱${parseInt(data.total_paid, 10).toFixed(2)}`,
          remarks: data.remarks,
          //   action: data.status === 'unsettled' ? (
          //     <>
          //       <Tooltip title="Update">
          //         <IconButton
          //           onClick={async () => {
          //             navigate(`view/${data.id}`)
          //           }}
          //         >
          //           <Iconify icon="material-symbols:edit" />
          //         </IconButton>
          //       </Tooltip>
          //     </>
          //   ) : null,
        }))
      );
    }
  }, [paymentsStatus, paymentsData]);

  return (
    <Page title="Payments">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={'Payments Records'}
          buttonTitle={'New Payment'}
          buttonFunction={() => {
            navigate('create');
          }}
          TABLE_HEAD={[
            { id: 'violator', label: 'Violator Full Name', alignRight: false },
            { id: 'paymentDate', label: 'Payment Date', alignRight: false },
            { id: 'paymentMethod', label: 'Payment Method', alignRight: false },
            { id: 'subTotal', label: 'Sub Total', alignRight: false },
            { id: 'discount', label: 'Discount', alignRight: false },
            { id: 'totalAmount', label: 'Total Amount', alignRight: false },
            { id: 'totalPaid', label: 'Total Paid', alignRight: false },
            { id: 'remarks', label: 'Remarks', alignRight: false },
            //   { id: 'action', label: 'Action', alignRight: false },
          ]}
          searchTitle='Search Full Name...'
          TABLE_DATA={paymentList}
        />
      </Container>
    </Page>
  );
}
