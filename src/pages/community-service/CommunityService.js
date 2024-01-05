import React, {useEffect, useState} from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
// material
import { Container, Tooltip, IconButton, capitalize } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Page from '../../components/Page';

// mock
import AppTable from '../../components/table/AppTable';

// api
import communityServicesApi from '../../service/communityServicesApi';
// ----------------------------------------------------------------------

export default function CommunityService() {
  const {getAllCommunityServices} = communityServicesApi
  const navigate = useNavigate();
  const [communityServiceList, setCommunityServiceList] = useState([]);
  const {
    data: communityServiceData,
    status: communityServiceStatus,
    isFetching: communityServiceIsFetching,
  } = useQuery(['get-community-services'], () => getAllCommunityServices(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (communityServiceStatus === 'success') {
      console.log(communityServiceData)
      setCommunityServiceList(
        communityServiceData.data.map((data) => ({
          id: data.id,
          name: data?.citation?.violator?.last_name ? `${capitalize(data?.citation?.violator?.last_name)}, ${capitalize(data?.citation?.violator?.first_name)} ${capitalize(data?.citation?.violator?.middle_name)}` : "N/A",
          tobeSearch: `${data?.citation?.violator?.last_name} ${data?.citation?.violator?.first_name} ${data?.citation?.violator?.middle_name}`,
          service: data.service.service_name,
          timeToRender: data.service.time_to_render,
          renderedTime: data.rendered_time,
          timeRemaining: parseInt(data.service.time_to_render, 10) - parseInt(data.rendered_time, 10),
          status: (
            <span style={{fontWeight: 'bold', color: data.status === 'unsettled' ? 'orange' : 'green'}}>
            {`${data.status.toUpperCase()}`}
          </span>
          ),
          action: data.status === 'unsettled' ? (
            <>
              <Tooltip title="Update">
                <IconButton
                  onClick={async () => {
                    navigate(`view/${data.id}`)
                  }}
                >
                  <Iconify icon="material-symbols:edit" />
                </IconButton>
              </Tooltip>
            </>
          ) : null,
        }))
      );
    }
  }, [communityServiceStatus, communityServiceData]);

  return (
    <Page title="Community Service">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={'Community Service'}
          buttonTitle={'New Community Service'}
          buttonFunction={() => {navigate('create')}}
          TABLE_HEAD={
            [
              // { id: 'id', label: 'ID', alignRight: false },
              { id: 'name', label: 'Full Name', alignRight: false },
              { id: 'service', label: 'Community Service Type', alignRight: false },
              { id: 'timeToRender', label: 'Time to Render', alignRight: false },
              { id: 'renderedTime', label: 'Rendered Time', alignRight: false },
              { id: 'timeRemaining', label: 'Time Remaining', alignRight: false },
              { id: 'status', label: 'Status', alignRight: false },
              { id: 'action', label: 'Action', alignRight: false },
            ]
          }
          searchTitle="Search Full Name..."
          TABLE_DATA={communityServiceList}
        />
      </Container>
    </Page>
  );
}
