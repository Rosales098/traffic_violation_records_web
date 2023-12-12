import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
// mui
import {
  Container,
  Typography,
  Box,
  Tooltip,
  IconButton,
  CardContent,
  Card,
  Avatar,
  Stack,
  Chip,
  Grid,
  Skeleton,
  Tab,
} from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { toast } from 'react-toastify';
// components
import AppTable from '../../components/table/AppTable';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import ViolationsComponent from '../../components/citation/violations';
import CreateViolator from '../../components/citation/violator';
import CreateLicense from '../../components/citation/license';
import VehicleComponent from '../../components/citation/vehicle';
import PlaceAndDateComponent from '../../components/citation/placeAndDate';
import Confirmation from '../../components/citation/confirmation';

function CreateCitation() {
  const [activeTab, setActiveTab] = useState('violations');

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Page title="Citation">
      <Container maxWidth="xl">
        <Box sx={{ marginTop: 5 }}>
          <TabContext value={activeTab}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Violations" value="violations" />
              <Tab label="Violator Informations" value="violator" />
              <Tab label="License Informations" value="license" />
              <Tab label="Vehicle Informations" value="vehicle" />
              <Tab label="Place and Date/Time" value="place&date" />
              <Tab label="Confirmation" value="confirmation" />
            </TabList>
            <TabPanel value="violations">
              <ViolationsComponent />
            </TabPanel>
            <TabPanel value="violator">
              <CreateViolator />
            </TabPanel>
            <TabPanel value="license">
              <CreateLicense />
            </TabPanel>
            <TabPanel value="vehicle">
              <VehicleComponent />
            </TabPanel>
            <TabPanel value="place&date">
              <PlaceAndDateComponent />
            </TabPanel>
            <TabPanel value="confirmation">
              <Confirmation />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </Page>
  );
}

export default CreateCitation;
