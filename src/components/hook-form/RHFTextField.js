import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextareaAutosize, Typography, Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { borderColor } from '@mui/system';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField({ name, ...other }) {
  const { control } = useFormContext();

  if (other?.inputType === 'dropDown') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextField
            {...other}
            fullWidth
            select
            SelectProps={{ native: true }}
            variant="outlined"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={!!error}
            helperText={error?.message}
            disabled={other.disabled}
          >
            {other.dropDownData?.map((option, key) => (
              <option key={key} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        )}
      />
    );
  }

  if (other?.inputType === 'datePicker') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              // inputFormat="MM/DD/YYYY"
              label={other.label || "Date of Birth"}
              // maxDate={new Date()}
              value={field.value}
              onChange={field.onChange}
              onError={error}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        )}
      />
    );
  }

  if (other?.inputType === 'textarea') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Box width={"100%"}>
            <TextareaAutosize
              {...field}
              style={{ width: '100%', fontSize: 16, borderColor: error ? 'red' : 'black', outline: 'none'}}
              value={field.value}
              error={!!error}
              helperText={error?.message}
              {...other}
            />
            {error ? <Typography sx={{color: '#FF3333', fontSize: 12, marginLeft: 2}}>{error.message}</Typography> : null}
          </Box>
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} fullWidth value={field.value} error={!!error} helperText={error?.message} {...other} />
      )}
    />
  );
}
