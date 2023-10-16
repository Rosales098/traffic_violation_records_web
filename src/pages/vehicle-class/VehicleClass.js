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

import { setVehicleClass, removeVehicleClass } from '../../store/VehicleSlice';
import CreateMake from './CreateVehicleClass';

// api
import vehicleApi from '../../service/vehicleApi';

// ----------------------------------------------------------------------

export default function VehicleClass() {
  const { getClass, deleteClass } = vehicleApi;
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
    dispatch(removeVehicleClass())
  };

  const {
    data: categoryData,
    status: categoryStatus,
    isFetching: categoryIsFetching,
  } = useQuery(['get-all-class'], () => getClass(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isLoad } = useMutation((payload) => deleteClass(payload), {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['get-all-class']);
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
          id: (
            <span>
              {`${data?.id}`}
            </span>
          ),
          class: <Typography sx={{textTransform: 'capitalize'}}>{data?.class}</Typography>,
          action: (
            <>
              <Tooltip title="View">
                <IconButton
                  onClick={async () => {
                    await dispatch(setVehicleClass({id: data?.id, classes: data?.class}));
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
    <Page title="Vehicle-Class">
      <Container>
        <AppTable
          tableTitle={'Vehicle Class'}
          buttonTitle={'New Class'}
          buttonFunction={() => {
            openDialog();
            setAction('create');
          }}
          TABLE_HEAD={[
            { id: 'id', label: 'ID', align: 'center' },
            { id: 'class', label: 'Class', align: 'center' },
            { id: 'action', label: 'Action', align: 'center' },
          ]}
          TABLE_DATA={categoryList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        // eslint-disable-next-line no-nested-ternary
        title={action === 'create' ? 'Creating Class' : action === 'update' ? 'Updating Class' : null}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <CreateMake handleClose={handleClose} action={action} setAction={setAction} deleteUserHandler={deleteUserHandler}/>
      </DialogModal>
    </Page>
  );
}
