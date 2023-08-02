import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Box, Checkbox, FormControlLabel, Stack, Grid, TextField } from '@mui/material';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { CChart, CChartBar } from '@coreui/react-chartjs';
import moment from 'moment';

// components
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Page from '../../../components/Page';
import AppTable from '../../../components/table/AppTable';
import CardContainer from '../../../components/CardContainer';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// api
import reportsApi from '../../../service/reportsApi';

const AdminReports = () => {
  const sectionRefs = useRef(null);

  const defaultValues = {
    reportType: undefined,
    yearStart: '',
    yearEnd: '',
    quarterYear: '',
    monthYear: '',
    fromMonth: undefined,
    toMonth: undefined,
  };

  const [yearList, setYearList] = useState([]);
  const [reportSelected, setReportSelected] = useState(1);
  const [graphLabel, setGraphLabel] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [reportData, setReportData] = useState([]);

  const monthList = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const { getIncomeReports } = reportsApi;
  const { mutate: fetchReport, isLoading: isLoad } = useMutation((payload) => getIncomeReports(payload), {
    onSuccess: (result) => {
      const graphLabel = [];
      const graphData = [];
      if (reportSelected === 1) {
        setReportData(result.data.breakdown);
        result.data.data.map((data) => graphLabel.push(data.year));
        setGraphLabel(graphLabel);
        result.data.data.map((data) => graphData.push(data.value));
        setGraphData(graphData);
      } else if (reportSelected === 2) {
        setReportData(result.data.breakdown);
        result.data.data.map((data) => graphLabel.push(data.quarter));
        setGraphLabel(graphLabel);
        result.data.data.map((data) => graphData.push(data.value));
        setGraphData(graphData);
      } else if (reportSelected === 3) {
        setReportData(result.data.breakdown);
        result.data.data.map((data) => graphLabel.push(monthList[data.month - 1].label));
        setGraphLabel(graphLabel);
        result.data.data.map((data) => graphData.push(data.value));
        setGraphData(graphData);
      } else {
        setGraphData([]);
        setGraphLabel([]);
      }
    },
    onError: (data) => {
      console.log(data);
      toast.error('Something went wrong');
    },
  });

  const validationSchema = Yup.object().shape({
    reportType: Yup.string().required('Report Type is required'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const yearListHandler = () => {
    const year = new Date().getFullYear();
    const arrayOfYears = [];
    Array.from(new Array(10), (v, i) => arrayOfYears.push({ value: year - i, label: year - i }));
    setYearList(arrayOfYears);
  };

  useEffect(() => {
    yearListHandler();
    reset({
      reportType: 1,
      monthYear: new Date().getFullYear(),
      fromMonth: 1,
      toMonth: 1,
      yearStart: new Date().getFullYear(),
      yearEnd: new Date().getFullYear(),
      quarterYear: new Date().getFullYear(),
    });
  }, [reset]);

  const onSubmit = async (data) => {
    let payload;
    switch (reportSelected) {
      case 1:
        payload = {
          mode: 'yearly',
          yearStart: data.yearStart,
          yearEnd: data.yearEnd,
        };
        break;

      case 2:
        payload = {
          mode: 'quarterly',
          year: data.quarterYear,
        };
        break;
      case 3:
        // get the current year
        payload = {
          mode: 'monthly',
          year: String(data.monthYear) === '' ? new Date().getFullYear() : data.monthYear,
          monthStart: data.fromMonth,
          monthEnd: data.toMonth,
        };
        break;

      default:
        break;
    }
    // eslint-disable-next-line eqeqeq
    if (reportSelected == 1 && data.yearStart > data.yearEnd) {
      return toast.error('Incorrect years selected.');
    }
    
    // eslint-disable-next-line eqeqeq
    if (reportSelected == 3 && parseInt(data.fromMonth, 10) > parseInt(data.toMonth, 10)) {
      return toast.error('Incorrect months selected.');
    }

    // eslint-disable-next-line eqeqeq
    if (reportSelected == 4 && data.dateRangeFrom > data.dateRangeTo) {
      return toast.error('Incorrect dates selected.');
    }

    fetchReport(payload);
  };

  return (
    <Page title="Report">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} id="reports" ref={sectionRefs[0]}>
        {/* <CardContainer title="Report Type" subtitle="Please select the type of report you would like to generate">
          <Box width="50%">
            <RHFTextField
              disabled
              name="reportType"
              placeholder="Select Report Type"
              inputType="dropDown"
              defaultValue={5}
              dropDownData={[
                { value: '1', label: 'Users' },
                { value: '2', label: 'Posted Article' },
                { value: '3', label: 'Used Links' },
                { value: '4', label: 'Unused Links' },
                { value: '5', label: 'Total Income' },
              ]}
            />
          </Box>
        </CardContainer> */}

        <Box marginTop={2}>
          <CardContainer>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Checkbox checked={reportSelected === 1} />}
                      label="Yearly Report"
                      onChange={() => {
                        setReportSelected(1);
                      }}
                    />
                    <Box>
                      <RHFTextField name="yearStart" inputType="dropDown" label="From" dropDownData={yearList} />
                    </Box>
                    <Box>
                      <RHFTextField name="yearEnd" inputType="dropDown" label="To" dropDownData={yearList} />
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Checkbox checked={reportSelected === 2} />}
                      label="Quarterly Report"
                      onChange={() => {
                        setReportSelected(2);
                      }}
                    />
                    <Box>
                      <RHFTextField name="quarterYear" inputType="dropDown" label="Year" dropDownData={yearList} />
                    </Box>
                    {/* <Box>
                        <RHFTextField name="quarter" type="dropDown" label="From" dropDownData={quarterList} />
                      </Box> */}
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Checkbox checked={reportSelected === 3} />}
                      label="Monthly Report"
                      onChange={() => {
                        setReportSelected(3);
                      }}
                    />
                    <Box>
                      <RHFTextField name="monthYear" inputType="dropDown" label="Year" dropDownData={yearList} />
                    </Box>
                    <Box>
                      <RHFTextField name="fromMonth" inputType="dropDown" label="From" dropDownData={monthList} />
                    </Box>
                    <Box>
                      <RHFTextField name="toMonth" inputType="dropDown" label="To" dropDownData={monthList} />
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </CardContainer>
        </Box>

        <Box width={200} marginTop={2}>
          <LoadingButton type="submit" variant="contained" color="primary" fullWidth loading={isLoad}>
            Generate
          </LoadingButton>
        </Box>

        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} sx={{marginTop: -3}}>
              <Box>
                <AppTable
                  hasButton={false}
                  title={`Click a date of payments to see the breakdown`}
                  TABLE_HEAD={[
                    { id: 'date', label: 'Date Paid' },
                    { id: 'subTotal', label: 'Sub Total' },
                    { id: 'discount', label: 'Discount' },
                    { id: 'totalAmount', label: 'Total Amount' },
                    { id: 'totalPaid', label: 'Total Paid' },
                  ]}
                  TABLE_DATA={
                    reportData.map((data) => ({
                      id: data.id,
                      date: (
                        <Typography
                          sx={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                          component={'span'}
                          onClick={() => {}}
                        >
                          {moment(data.payment_date).format('YYYY-MMMM-DD')}
                        </Typography>
                      ),
                      subTotal: `₱${data?.invoice?.sub_total}`,
                      discount: `${data?.invoice?.discount}%`,
                      totalAmount: (
                        <Typography
                          sx={{ cursor: 'pointer' }}
                          component={'span'}
                          onClick={() => {}}
                        >{`₱${parseInt(data?.invoice.total_amount, 10).toFixed(2)}`}</Typography>
                      ),
                      totalPaid: (
                        <Typography
                          sx={{ cursor: 'pointer' }}
                          component={'span'}
                          onClick={() => {}}
                        >{`₱${parseInt(data?.total_paid, 10).toFixed(2)}`}</Typography>
                      ),
                    })) || []
                  }
                  tablePagination
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{marginTop: 3}}>
              <CardContainer>
                <CChartBar
                  type="bar"
                  data={{
                    labels: graphLabel || [],
                    datasets: [
                      {
                        label: 'Total Income',
                        backgroundColor: '#007aff',
                        hoverBackgroundColor: '#004fff',
                        data: graphData || [],
                      },
                    ],
                  }}
                  labels="months"
                />
              </CardContainer>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Page>
  );
};

export default AdminReports;
