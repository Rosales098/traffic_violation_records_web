import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';

// sections
import {
  AppOrderTimeline,
  AppWidgetSummary,
} from '../../sections/@dashboard/app';
import DashboardApi from '../../service/DashboardApi';
import AdminGraph from './AdminGraph';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { getDashboard } = DashboardApi;
  const [dashboardList, setDashboardList] = useState([]);
  const {
    data: dashboardData,
    status: dashboardStatus,
    isFetching: dashboardIsFetching,
  } = useQuery(['get-dashboard'], () => getDashboard(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (dashboardStatus === 'success') {
      setDashboardList(dashboardData);
    }
  }, [dashboardData, dashboardStatus]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Number of Violations Recorded" total={dashboardList?.data?.citation} icon={'vaadin:records'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={dashboardList?.data?.usersCount} color="info" icon={'ph:users-four-duotone'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Number Invoice" total={dashboardList?.data?.invoice} color="warning" icon={'mdi:invoice'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Payments Collected" total={dashboardList?.data?.payments} color="error" icon={'bi:paypal'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {dashboardList?.data?.citationByMonth && (<AdminGraph lineGraphData={dashboardList?.data?.citationByMonth}/>)}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="New Users"
              list={dashboardList?.data?.users}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
