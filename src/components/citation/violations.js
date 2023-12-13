import { filter } from 'lodash';
import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// material
import { Container, Typography, Stack, Button, Tooltip, IconButton, Box } from '@mui/material';

// components
import Iconify from '../Iconify';
import AppTable from '../table/AppTable';
import DialogModal from '../dialog-modal/DialogModal';
import ViolationsApi from '../../service/ViolationsApi';
import ViolationCategoriesApi from '../../service/ViolationCategoriesApi';

import { setViolation, removeViolation } from '../../store/ViolationSlice';
import { setViolations, removeAViolation } from '../../store/CitationSlice';

// ----------------------------------------------------------------------

export default function ViolationsComponent() {
  const { getViolations } = ViolationsApi;
  const { getCategory } = ViolationCategoriesApi;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [violationList, setViolationList] = useState([]);
  const [action, setAction] = useState('create');

  const { violations } = useSelector((store) => store.citation);
  console.log(violations);

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
          tobeSearch: data.violation_name,
          id: <span>{`#${data.id}`}</span>,
          categoryName: data.category.category_name,
          violation: data.violation_name,
          penalty: <span>{`P${parseInt(data.penalty, 10).toFixed(2)}`}</span>,
          description: data.description,
          action: (
            <>
              <Tooltip title="Add">
                <IconButton
                  onClick={async () => {
                    await dispatch(setViolations(data));
                    openDialog();
                    setAction('update');
                  }}
                >
                  <Iconify icon="material-symbols:add" />
                </IconButton>
              </Tooltip>
            </>
          ),
        }))
      );
    }
  }, [violationStatus, violationIsFetching]);

  return (
    <Container>
      <Box sx={{ backgroundColor: 'white', marginTop: 2, padding: 5, borderRadius: 2, display: 'flex', gap: 3 }}>
        {violations.map((data) => (
          // eslint-disable-next-line react/jsx-key
          <Box sx={{display: 'flex', alignItems: 'center', border: 1, borderColor: 'gray', borderRadius: 2, padding: 1}}>
            <Typography sx={{ fontSize: 18, textTransform: 'capitalize' }}>{data.violation_name}</Typography>
            <IconButton
              onClick={async () => {
                await dispatch(removeAViolation(data.id));
              }}
            >
              <Iconify icon="material-symbols:delete-outline" />
            </IconButton>
          </Box>
        ))}
      </Box>
      <AppTable
        // tableTitle={'Violation List'}
        // buttonTitle={'New Violation'}
        hasButton={false}
        buttonFunction={() => {
          openDialog();
          setAction('create');
        }}
        TABLE_HEAD={[
          //   { id: 'id', label: 'ID', align: 'center' },
          //   { id: 'categoryName', label: 'Category Name', align: 'left' },
          { id: 'violation', label: 'Violation', align: 'left' },
          { id: 'penalty', label: 'Penalty Amount', align: 'left' },
          { id: 'description', label: 'Description', align: 'left' },
          { id: 'action', label: 'Action', align: 'center' },
        ]}
        searchTitle="Search Violation..."
        TABLE_DATA={violationList}
      />
    </Container>
  );
}
