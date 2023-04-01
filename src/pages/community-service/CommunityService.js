import { filter } from 'lodash';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// components
import Page from '../../components/Page';

// mock
import USERLIST from '../../_mock/user';
import AppTable from '../../components/table/AppTable';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

export default function CommunityService() {
  console.log(USERLIST)
  return (
    <Page title="User">
      <Container>
        <AppTable
          tableTitle={'User'}
          buttonTitle={'New User'}
          TABLE_HEAD={TABLE_HEAD}
          TABLE_DATA={[
            {
              id: 1,
              name: 'Arjohn',
              company: 'wewe'
            },
            {
              id: 2,
              name: 'Nicollyn',
              company: 'qweqw'
            }
          ]}
        />
      </Container>
    </Page>
  );
}
