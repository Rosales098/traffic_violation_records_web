import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// material
import { Container, Typography, Stack, Button, Tooltip, IconButton } from '@mui/material';

// components
import Iconify from '../../components/Iconify';
import Page from '../../components/Page';
import AppTable from '../../components/table/AppTable';
import DialogModal from '../../components/dialog-modal/DialogModal';
import ViolationCategoriesApi from '../../service/ViolationCategoriesApi';
import communityServiceTypesApi from '../../service/communityServiceTypesApi';
import { setServiceType } from '../../store/ServiceTypeSlice';

// ----------------------------------------------------------------------

export default function CommunityServiceTypes() {
  const { getAllCommunityServicesTypes } = communityServiceTypesApi;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [action, setAction] = useState('create');
  const { category } = useSelector((store) => store.category);

  const {
    data: serviceTypesData,
    status: serviceTypesStatus,
    isFetching: serviceTypesIsFetching,
  } = useQuery(['get-all-service-types'], () => getAllCommunityServicesTypes(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });
  
  useEffect(() => {
    if (serviceTypesStatus === 'success') {
      setCategoryList(
        serviceTypesData?.data.map((data) => ({
          id: (
            <span>
              {`#${data.id}`}
            </span>
          ),
          service_name: data.service_name,
          discount: `${data.discount}%`,
          time_to_render: `${data.time_to_render} hours`,
          action: (
            <>
              <Tooltip title="View">
                <IconButton
                  onClick={async () => {
                    await dispatch(setServiceType(data));
                    navigate('view');
                  }}
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              {/* <Tooltip
                title="Delete"
                onClick={() => {
                  dispatch(setCategory(data));
                  openDialog();
                  setAction('delete');
                }}
              >
                <IconButton>
                  <Iconify icon="bxs:trash" />
                </IconButton>
              </Tooltip> */}
            </>
          ),
        }))
      );
    }
  }, [serviceTypesStatus, serviceTypesData, dispatch]);

  return (
    <Page title="Violation-Categories">
      <Container>
        <AppTable
          tableTitle={'Community Service Types'}
          buttonTitle={'New Service'}
          buttonFunction={() => {
            navigate('create')
          }}
          TABLE_HEAD={[
            { id: 'id', label: 'ID', align: 'center' },
            { id: 'service_name', label: 'Community Service Name', align: 'center' },
            { id: 'discount', label: 'Discount', align: 'center' },
            { id: 'time_to_render', label: 'Time to Render', align: 'center' },
            { id: 'action', label: 'Action', align: 'center' },
          ]}
          TABLE_DATA={categoryList}
        />
      </Container>
    </Page>
  );
}
