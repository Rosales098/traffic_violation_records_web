import React, { useState } from 'react';
import { useMutation } from 'react-query';
import {toast} from 'react-toastify';
// @mui
import { TextField, TextareaAutosize, Typography, Box, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import PDFreport from './DownloadPdf';
import reportsApi from '../../../service/reportsApi';

export const DateModal = ({ handleClose }) => {
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTemptEndDate] = useState(new Date());
  const {getUnsettled} = reportsApi;

  const { mutate: getReport, isLoading } = useMutation((payload) => getUnsettled(payload), {
    onSuccess: async (data) => {
      console.log(data.data.data)
      await PDFreport(data.data, tempStartDate, tempEndDate)
      handleClose();
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const onChangeStartDate = (e) => {
    setTempStartDate(e)
  };

  const onChangeEndDate = (e) => {
    setTemptEndDate(e)
  };

  const printReport = async () => {
    const payload = {
      dateStart: tempStartDate,
      dateEnd: tempEndDate
    }
    await getReport(payload)
  }

  return (
    <>
      <Box sx={{ display: 'grid', gap: 2, marginTop: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // inputFormat="MM/DD/YYYY"
            label={'Start Date'}
            // maxDate={new Date()}
            value={tempStartDate}
            onChange={(e) => onChangeStartDate(e)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // inputFormat="MM/DD/YYYY"
            label={'End Date'}
            // maxDate={new Date()}
            value={tempEndDate}
            onChange={(e) => onChangeEndDate(e)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button variant='contained' onClick={printReport}>
          Print Report
        </Button>
      </Box>
    </>
  );
};
