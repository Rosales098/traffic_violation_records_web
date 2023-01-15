// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Violation Categories',
    path: '/violation-categories',
    icon: getIcon('carbon:category'),
  },
  {
    title: 'Violations List',
    path: '/violations-list',
    icon: getIcon('mdi:warning-octagon'),
  },
  {
    title: 'Citation Records',
    path: '/violations-records',
    icon: getIcon('mdi:account-warning'),
  },
  {
    title: 'Community Service',
    path: '/community-services',
    icon: getIcon('healthicons:community-meeting'),
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: getIcon('material-symbols:payments-outline-sharp'),
  },
  {
    title: 'Users',
    path: '/users',
    icon: getIcon('eva:people-fill'),
  },
  // {
  //   title: 'Payments',
  //   path: '/payments',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
