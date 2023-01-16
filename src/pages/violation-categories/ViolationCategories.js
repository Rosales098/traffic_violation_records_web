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
import ViolationCategoriesApi from '../../service/ViolationCategoriesApi';

import { setCategory, removeCategory } from '../../store/CategoriesSlice';
import CreateCategories from './CreateCategories';

// ----------------------------------------------------------------------

export default function ViolationCategories() {
  const { getCategory, deleteCategory } = ViolationCategoriesApi;
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
    dispatch(removeCategory())
  };

  const {
    data: categoryData,
    status: categoryStatus,
    isFetching: categoryIsFetching,
  } = useQuery(['get-all-categories'], () => getCategory(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isLoad } = useMutation((payload) => deleteCategory(payload), {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['get-all-categories']);
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
        categoryData.data.map((data) => ({
          id: (
            <span>
              {`#${data.id}`}
            </span>
          ),
          categoryName: data.category_name,
          action: (
            <>
              <Tooltip title="View">
                <IconButton
                  onClick={async () => {
                    await dispatch(setCategory(data));
                    openDialog();
                    setAction('update');
                  }}
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              <Tooltip
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
              </Tooltip>
            </>
          ),
        }))
      );
    }
  }, [categoryStatus, categoryIsFetching]);

  return (
    <Page title="Violation-Categories">
      <Container>
        <AppTable
          tableTitle={'Violation Categories'}
          buttonTitle={'New Category'}
          buttonFunction={() => {
            openDialog();
            setAction('create');
          }}
          TABLE_HEAD={[
            { id: 'id', label: 'ID', align: 'center' },
            { id: 'categoryName', label: 'Category Name', align: 'center' },
            { id: 'action', label: 'Action', align: 'center' },
          ]}
          TABLE_DATA={categoryList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        // eslint-disable-next-line no-nested-ternary
        title={action === 'create' ? 'Creating Category' : action === 'update' ? 'Updating Category' : null}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <CreateCategories handleClose={handleClose} action={action} setAction={setAction} deleteUserHandler={deleteUserHandler}/>
      </DialogModal>
    </Page>
  );
}
