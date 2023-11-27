/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Grid,
  TextField,
  capitalize,
} from '@mui/material';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import { useMutation, useQuery } from 'react-query';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { CChart, CChartBar } from '@coreui/react-chartjs';
import moment from 'moment';
import { useForm } from 'react-hook-form';

// components
import DialogModal from '../../../components/dialog-modal/DialogModal';
import Page from '../../../components/Page';
import AppTable from '../../../components/table/AppTable';
import CardContainer from '../../../components/CardContainer';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// api
import reportsApi from '../../../service/reportsApi';
import ViolationsApi from '../../../service/ViolationsApi';
import { DateModal } from './DateModal';

const AdminReports = () => {
  const sectionRefs = useRef(null);

  const defaultValues = {
    // violationId: null,
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
  const [violationList, setViolationList] = useState([]);
  const [topViolation, setTopViolation] = useState([]);
  const [open, setOpen] = useState(false);

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

  const { getIncomeReports, getViolationReports, getTopCommittedViolations } = reportsApi;
  const { getViolations } = ViolationsApi;

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

  const { mutate: fetchTop } = useMutation((payload) => getTopCommittedViolations(payload), {
    onSuccess: (result) => {
      console.log(result.data);
      setTopViolation(result?.data);
    },
    onError: (data) => {
      console.log(data);
      toast.error('Something went wrong');
    },
  });

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
        violationData.data?.map((data) => ({
          value: data.id,
          label: data.violation_name.toUpperCase(),
        }))
      );
    }
  }, [violationData, violationStatus]);

  const methods = useForm({
    // resolver: yupResolver(validationSchema),
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
      violationId: violationData?.data[0]?.id,
      monthYear: new Date().getFullYear(),
      fromMonth: 1,
      toMonth: 1,
      yearStart: new Date().getFullYear(),
      yearEnd: new Date().getFullYear(),
      quarterYear: new Date().getFullYear(),
    });
  }, [reset, violationData?.data]);

  const onSubmit = async (data) => {
    let payload;
    switch (reportSelected) {
      case 1:
        payload = {
          // violation_id: data.violationId,
          mode: 'yearly',
          yearStart: data.yearStart,
          yearEnd: data.yearEnd,
        };
        break;

      case 2:
        payload = {
          // violation_id: data.violationId,
          mode: 'quarterly',
          year: data.quarterYear,
        };
        break;
      case 3:
        // get the current year
        payload = {
          // violation_id: data.violationId,
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

    await fetchReport(payload);
    await fetchTop(payload);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="Report">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} id="reports" ref={sectionRefs[0]}>
        {/* <CardContainer
          title="Violations"
          // subtitle="Please select the v of report you would like to generate"
        >
          <Box width="50%">
            <RHFTextField
              name="violationId"
              placeholder="Select Report Type"
              inputType="dropDown"
              defaultValue={violationList[0]?.value}
              dropDownData={violationList}
            />
          </Box>
        </CardContainer> */}
        <Box marginTop={2}>
          <CardContainer>
            <Box width={200} marginTop={2} sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                variant="contained"
                color="primary"
                sx={{ placeSelf: 'flex-end', width: 200 }}
                onClick={() => setOpen(true)}
              >
                Print Report
              </LoadingButton>
            </Box>
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
            <Grid item xs={12} sm={6} md={6} sx={{ marginTop: -3 }}>
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
                  showSearch={false}
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
                      discount: `₱${data?.invoice?.discount}`,
                      totalAmount: (
                        <Typography sx={{ cursor: 'pointer' }} component={'span'} onClick={() => {}}>{`₱${parseInt(
                          data?.invoice.total_amount,
                          10
                        ).toFixed(2)}`}</Typography>
                      ),
                      totalPaid: (
                        <Typography sx={{ cursor: 'pointer' }} component={'span'} onClick={() => {}}>{`₱${parseInt(
                          data?.total_paid,
                          10
                        ).toFixed(2)}`}</Typography>
                      ),
                    })) || []
                  }
                  tablePagination
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{ marginTop: 3 }}>
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
            <Typography sx={{ fontWeight: 'bold', marginLeft: 2, fontSize: 24 }}>Most committed violation</Typography>
            <Grid item xs={12} sm={12} md={12} sx={{ marginTop: 0, display: 'flex', gap: 5 }}>
              {topViolation?.data?.slice(0, 6).map((data) => {
                return (
                  <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>
                    {data?.name}
                    {data?.violation?.length > 0 ? (
                      data?.violation?.map((data) => (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography sx={{ fontSize: 18 }}>{`-${data?.name}`}</Typography>
                          <Typography sx={{ fontSize: 18 }}>{`${data?.total}x`}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ fontSize: 18 }}>-NO DATA</Typography>
                    )}
                  </Typography>
                );
              })}
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ marginTop: 3, display: 'flex', gap: 5 }}>
              {topViolation?.data?.slice(6, 12).map((data) => {
                return (
                  <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>
                    {data?.name}
                    {data?.violation?.length > 0 ? (
                      data?.violation?.map((data) => (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography sx={{ fontSize: 18 }}>{data?.name}</Typography>
                          <Typography sx={{ fontSize: 18 }}>{`${data?.total}x`}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ fontSize: 18 }}>NO DATA</Typography>
                    )}
                  </Typography>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
      <DialogModal
        open={open}
        handleClose={handleClose}
        // eslint-disable-next-line no-nested-ternary
        title={"Select Date Range"}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
        width="sm"
      >
        <DateModal handleClose={handleClose}/>
      </DialogModal>
    </Page>
  );
};

export default AdminReports;
