import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
// form
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Tooltip, IconButton, Breadcrumbs } from '@mui/material';
// hooks
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
import ViewUserForm from '../../components/user/ViewUserForm';
import UserApi from '../../service/UserApi';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    marginTop: -150,
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '60%',
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ViewUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState('details');
  const { updateUser } = UserApi;
  const { user } = useSelector((store) => store.user);

  const { mutate: Update, isLoading: isLoad } = useMutation((payload) => updateUser(user.id, payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-all-users']);
      toast.success('Updated successfully');
      setIsLoading(false);
      navigate(-1);
    },
    onError: (data) => {
      console.log(data);
      toast.error(data.response.data.message);
      setIsLoading(false);
    },
  });

  const onSubmit = async (data) => {
    // setIsLoading(true);
    const payload = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      gender: data.gender,
      phone_number: data.phoneNumber,
      dob: moment(data.dob).format('MM/DD/YYYY'),
      role: data.role,
      email: user.email,
      status: data.status,
    };
    await Update(payload);
  };

  return (
    <Page title="Register">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div style={{ padding: 5, zIndex: 9999, marginBottom: 20 }}>
              <Tooltip title="View">
                <IconButton onClick={() => navigate(-1)}>
                  <Iconify icon="ion:arrow-back-circle" sx={{ width: 30, height: 30 }} />
                </IconButton>
              </Tooltip>
              <Typography variant="h4" gutterBottom sx={{ mb: 2, alignSelf: 'flex-end' }}>
                Viewing User Account
              </Typography>

              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => setCurrentPage('details')}
                  style={{ cursor: 'pointer' }}
                >
                  Account Details
                </Link>
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => setCurrentPage('security')}
                  style={{ cursor: 'pointer' }}
                >
                  Security
                </Link>
              </Breadcrumbs>
            </div>

            <ViewUserForm currentPage={currentPage} onSubmit={onSubmit} isLoading={isLoading} setIsLoading={setIsLoading} user={user} />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3, alignSelf: 'flex-start' }}>
              Traffic Violation Record @ 2023
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
