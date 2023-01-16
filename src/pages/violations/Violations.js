import { filter } from 'lodash';
import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// material
import { Container, Typography, Stack, Button, Tooltip, IconButton } from '@mui/material';

// components
import Iconify from '../../components/Iconify';
import Page from '../../components/Page';
import AppTable from '../../components/table/AppTable';
import DialogModal from '../../components/dialog-modal/DialogModal';
import ViolationsApi from '../../service/ViolationsApi';
import ViolationCategoriesApi from '../../service/ViolationCategoriesApi';

import { setViolation, removeViolation } from '../../store/ViolationSlice';
import CreateViolation from './CreateViolation';

// ----------------------------------------------------------------------

export default function ViolationsPage() {
  const { getViolations } = ViolationsApi;
  const { getCategory } = ViolationCategoriesApi;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [violationList, setViolationList] = useState([]);
  const [action, setAction] = useState('create');

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(removeViolation());
  };

  const {
    data: categoryData,
    status: categoryStatus,
    isFetching: categoryIsFetching,
  } = useQuery(['get-all-categories'], () => getCategory(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (categoryStatus === 'success') {
      setCategoryList(
        categoryData.data.map((data) => ({
          id: data.id,
          value: data.id,
          label: data.category_name,
        }))
      );
    }
  }, [categoryStatus, categoryIsFetching]);

  const {
    data: violationData,
    status: violationStatus,
    isFetching: violationIsFetching,
  } = useQuery(['get-all-violations'], () => getViolations(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (violationStatus === 'success') {
      setViolationList(
        violationData.data.map((data) => ({
          id: <span>{`#${data.id}`}</span>,
          categoryName: data.category.category_name,
          violation: data.violation_name,
          penalty: (
            <span>
              {`P${parseInt(data.penalty, 10).toFixed(2)}`}
            </span>
          ),
          description: data.description,
          action: (
            <>
              <Tooltip title="View">
                <IconButton
                  onClick={async () => {
                    await dispatch(setViolation(data));
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
                  dispatch(setViolation(data));
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
  }, [violationStatus, violationIsFetching]);

  return (
    <Page title="Violation List">
      <Container>
        <AppTable
          tableTitle={'Violation List'}
          buttonTitle={'New Violation'}
          buttonFunction={() => {
            openDialog();
            setAction('create');
          }}
          TABLE_HEAD={[
            { id: 'id', label: 'ID', align: 'center' },
            { id: 'categoryName', label: 'Category Name', align: 'left' },
            { id: 'violation', label: 'Violation', align: 'left' },
            { id: 'penalty', label: 'Penalty Amount', align: 'left' },
            { id: 'description', label: 'Description', align: 'left' },
            { id: 'action', label: 'Action', align: 'center' },
          ]}
          TABLE_DATA={violationList}
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
        <CreateViolation handleClose={handleClose} action={action} setAction={setAction} categoryList={categoryList} />
      </DialogModal>
    </Page>
  );
}
