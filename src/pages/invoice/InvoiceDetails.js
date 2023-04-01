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

export default function InvoiceDetails() {
  const { getAllCommunityServicesTypes } = communityServiceTypesApi;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [action, setAction] = useState('create');
  const { category } = useSelector((store) => store.category);

  return (
    <Page title="Violation-Categories">
      <Container sx={{ padding: 5 }}>
        <Typography>RTMO</Typography>
        <Typography>Traffice Violation Records</Typography>
        <Stack direction={{ xs: 'column', sm: 'row', }} spacing={30} sx={{marginLeft: 10, marginTop: 3}}>
          <Typography>Bill To:</Typography>
          <Typography>Invoice #</Typography>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row', }} spacing={30} sx={{marginLeft: 10, marginTop:1}}>
          <Typography>Name</Typography>
          <Typography>Invoice Date</Typography>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row', }} spacing={30} sx={{marginLeft: 10, marginTop:1}}>
          <Typography>Address</Typography>
        </Stack>
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
              {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack sx={{marginLeft: 10, marginTop:1, placeItems: 'flex-end'}} spacing={1}>
          <Typography>Sub Total</Typography>
          <Typography>Discount</Typography>
          <Typography>Total</Typography>
        </Stack>
      </Container>
    </Page>
  );
}
