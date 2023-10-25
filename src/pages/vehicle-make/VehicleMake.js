import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

import { setVehicleMake, removeVehicleMake } from '../../store/VehicleSlice';
import CreateMake from './CreateVehicleMake';

// api
import vehicleApi from '../../service/vehicleApi';

// ----------------------------------------------------------------------

export default function VehicleMake() {
  const { getMake, deleteMake } = vehicleApi;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [action, setAction] = useState('create');
  const { category } = useSelector((store) => store.category);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(removeVehicleMake())
  };

  const {
    data: categoryData,
    status: categoryStatus,
    isFetching: categoryIsFetching,
  } = useQuery(['get-all-make'], () => getMake(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isLoad } = useMutation((payload) => deleteMake(payload), {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['get-all-make']);
      toast.success('Deleted successfully.');
      handleClose();
    },
    onError: (data) => {
      toast.error('Failed to delete.');
    },
  });

  const deleteUserHandler = async () => {
    await Delete(category.id)
  };

  useEffect(() => {
    if (categoryStatus === 'success') {
      setCategoryList(
        categoryData?.data?.map((data) => ({
          tobeSearch: data.make,
          id: (
            <span>
              {`${data?.id}`}
            </span>
          ),
          make: <Typography sx={{textTransform: 'capitalize'}}>{data?.make}</Typography>,
          action: (
            <>
              <Tooltip title="View">
                <IconButton
                  onClick={async () => {
                    await dispatch(setVehicleMake(data));
                    openDialog();
                    setAction('update');
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
  }, [categoryStatus, categoryData?.data, dispatch]);

  return (
    <Page title="Vehicle-Make">
      <Container>
        <AppTable
          tableTitle={'Vehicle Make'}
          buttonTitle={'New Make'}
          buttonFunction={() => {
            openDialog();
            setAction('create');
          }}
          TABLE_HEAD={[
            { id: 'id', label: 'ID', align: 'center' },
            { id: 'make', label: 'Make', align: 'center' },
            { id: 'action', label: 'Action', align: 'center' },
          ]}
          searchTitle='Search Make...'
          TABLE_DATA={categoryList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        // eslint-disable-next-line no-nested-ternary
        title={action === 'create' ? 'Creating Make' : action === 'update' ? 'Updating Make' : null}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <CreateMake handleClose={handleClose} action={action} setAction={setAction} deleteUserHandler={deleteUserHandler}/>
      </DialogModal>
    </Page>
  );
}
