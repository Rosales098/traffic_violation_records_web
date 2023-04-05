import React, {useEffect, useState} from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
// material
import { Container, Tooltip, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Page from '../../components/Page';

// mock
import AppTable from '../../components/table/AppTable';

// api
import paymentApi from '../../service/paymentApi';
// ----------------------------------------------------------------------

export default function Payments() {
  const {getPayments} = paymentApi
  const navigate = useNavigate();
  const [paymentList, setPaymentList] = useState([]);

  const {
    data: paymentsData,
    status: paymentsStatus,
    isFetching: paymentIsFetching,
  } = useQuery(['get-payments'], () => getPayments(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (paymentsStatus === 'success') {
        setPaymentList(
        paymentsData.data.map((data) => ({
          id: data.id,
          violator: `${data?.invoice?.citation?.violator?.last_name}, ${data?.invoice?.citation?.violator?.first_name} ${data?.invoice?.citation?.violator?.middle_name}`,
          paymentDate: data.payment_date,
          paymentMethod: data.payment_method.toUpperCase(),
          subTotal: `₱${data.invoice.sub_total}`,
          discount: `${data.invoice.discount}%`,
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
          buttonFunction={() => {navigate('create')}}
          TABLE_HEAD={
            [
              { id: 'violator', label: 'Violator Full Name', alignRight: false },
              { id: 'paymentDate', label: 'Payment Date', alignRight: false },
              { id: 'paymentMethod', label: 'Payment Method', alignRight: false },
              { id: 'subTotal', label: 'Sub Total', alignRight: false },
              { id: 'discount', label: 'Discount', alignRight: false },
              { id: 'totalAmount', label: 'Total Amount', alignRight: false },
              { id: 'totalPaid', label: 'Total Paid', alignRight: false },
              { id: 'remarks', label: 'Remarks', alignRight: false },
            //   { id: 'action', label: 'Action', alignRight: false },
            ]
          }
          TABLE_DATA={paymentList}
        />
      </Container>
    </Page>
  );
}
