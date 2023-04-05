import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// material
import {
  Container,
  Stack,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Page from '../../components/Page';
import AppTable from '../../components/table/AppTable';
import DialogModal from '../../components/dialog-modal/DialogModal';
import ViolationCategoriesApi from '../../service/ViolationCategoriesApi';
import communityServiceTypesApi from '../../service/communityServiceTypesApi';
import { setServiceType } from '../../store/ServiceTypeSlice';

// ----------------------------------------------------------------------

export default function InvoiceDetails({ invoiceDetailsData }) {
  const { getAllCommunityServicesTypes } = communityServiceTypesApi;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [action, setAction] = useState('create');
  const { category } = useSelector((store) => store.category);

  console.log(invoiceDetailsData);
  return (
    <Page title="Violation-Categories">
      <Container sx={{ padding: 5 }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: 26 }}>RTMO</Typography>
        <Typography>Traffice Violation Records</Typography>
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={6} md={6}>
            <Typography>Bill To:</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Typography>Name:</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{`${
                invoiceDetailsData.citation.violator.first_name
              } ${invoiceDetailsData.citation.violator.middle_name.charAt()}. ${
                invoiceDetailsData.citation.violator.last_name
              }`}</Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Typography>Address:</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{invoiceDetailsData.citation.violator.address}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Typography>Invoice #:</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{invoiceDetailsData.id}</Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Typography>Invoice Date:</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{invoiceDetailsData.date}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Violation Category</TableCell>
                <TableCell>Violation</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Penalty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceDetailsData?.violations?.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {/* <TableCell component="th" scope="row">
                {row.name}
              </TableCell> */}
              <TableCell align="left">{row.category?.category_name.toUpperCase()}</TableCell>
              <TableCell align="left">{row.violation_name.toUpperCase()}</TableCell>
              <TableCell align="left">{row.description}</TableCell>
              <TableCell align="left">{`₱${parseInt(row.penalty, 10)?.toFixed(2)}`}</TableCell>
            </TableRow>
          ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack sx={{ marginLeft: 10, marginTop: 1, placeItems: 'flex-end' }} spacing={1}>
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6} md={9}>
              {}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                  <Typography>Sub Total:</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Typography sx={{ fontWeight: 'bold' }}>{`₱${invoiceDetailsData.sub_total}`}</Typography>
                </Grid>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                  <Typography>Discount:</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Typography sx={{ fontWeight: 'bold' }}>{`${invoiceDetailsData.discount}%`}</Typography>
                </Grid>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                  <Typography>Total:</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Typography sx={{ fontWeight: 'bold' }}>{`₱${invoiceDetailsData.total_amount}`}</Typography>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Page>
  );
}
