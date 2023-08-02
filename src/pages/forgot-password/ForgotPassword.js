/* eslint-disable eqeqeq */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';

// api
import forgotPasswordApi from '../../service/forgotPasswordApi';

const theme = createTheme();

const ForgotPassword = () => {
  const { forgotPassword } = forgotPasswordApi;
  const [showPassword, setShowPassword] = React.useState(false);

  const { mutate: requestReset, isLoading: isLoad } = useMutation((payload) => forgotPassword(payload), {
    onSuccess: (result) => {
      console.log(result);
      if(result?.data?.status == 422) {
       return toast.error(result.data.message);
      }
      toast.success(result.data.message);
    },
    onError: (data) => {
      console.log(data);
      toast.error('Something went wrong');
    },
  });

  const defaultValues = {
    email: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Please enter your Email'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control
  } = methods;

  const onSubmit = async (data) => {
    await requestReset(data)
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
                      error={!!error} helperText={error?.message} 
                    />
                  )}
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                {}
              </Grid>
            </Grid>
            <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={isLoad}>
              Send Password Reset Link
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPassword;
