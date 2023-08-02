/* eslint-disable eqeqeq */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/Iconify';

// api
import forgotPasswordApi from '../../service/forgotPasswordApi';

const theme = createTheme();

const ResetPassword = () => {
  const { resetPassword } = forgotPasswordApi;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const location = useLocation()
  const token = location.search.replace('?token=','');

  const { mutate: reset, isLoading: isLoad } = useMutation((payload) => resetPassword(payload), {
    onSuccess: (result) => {
      console.log(result);
      if (result?.data?.status == 422) {
        return toast.error(result.data.message);
      }
      toast.success(result.data.message);
      navigate('/signin')
    },
    onError: (data) => {
      console.log(data);
      toast.error(data.response.data.message);
    },
  });

  const defaultValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Please enter your Email'),
    newPassword: yup.string().required('Please enter your Password').min(6, 'Password must be atleast 6 characters.'),
    confirmPassword: yup
      .string()
      .required('Please enter your Password')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const onSubmit = async (data) => {
    const payload = {
      token,
      email: data.email,
      password: data.newPassword,
      password_confirmation: data.confirmPassword
    };
    await reset(payload);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>{/* <LockOutlinedIcon /> */}</Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} style={{ width: 400 }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label="Email"
                      id="email"
                      autoComplete="email"
                      name="email"
                      autoFocus
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                  name="email"
                />
              </Grid>
              <Grid item xs={12} md={12} style={{ width: 400 }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label="New Password"
                      id="newPassword"
                      name="newPassword"
                      autoFocus
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  name="newPassword"
                />
              </Grid>
              <Grid item xs={12} md={12} style={{ width: 400 }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      autoFocus
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                              <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  name="confirmPassword"
                />
              </Grid>
            </Grid>
            <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={isLoad}>
              Reset Password
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ResetPassword;
