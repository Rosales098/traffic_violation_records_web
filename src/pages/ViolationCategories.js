import { filter } from 'lodash';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// components
import Page from '../components/Page';
import AppTable from '../components/table/AppTable';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

export default function ViolationCategories() {

  return (
    <Page title="Violation-Categories">
      <Container>
        <AppTable
          tableTitle={'Violation-Categories'}
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
