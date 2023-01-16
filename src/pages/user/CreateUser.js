import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Tooltip, IconButton } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
import CreateUserForm from '../../components/user/CreateUserForm';

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

export default function CreateUser() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const navigation = useNavigate();

  return (
    <Page title="Register">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div style={{padding: 5, zIndex: 9999}}>
              <Tooltip title="View">
                <IconButton onClick={() => navigation(-1)}>
                  <Iconify icon="ion:arrow-back-circle" sx={{width: 30, height: 30}} />
                </IconButton>
              </Tooltip>
              <Typography variant="h4" gutterBottom sx={{ mb: 2, alignSelf: 'flex-end' }}>
                Creating User Account
              </Typography>
            </div>
            <CreateUserForm />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3, alignSelf: 'flex-start' }}>
              Traffic Violation Record @ 2023
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                Already have an account?{' '}
                <Link variant="subtitle2" to="/login" component={RouterLink}>
                  Login
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
