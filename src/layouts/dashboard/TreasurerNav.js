// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const TreasurerNav = [
  {
    title: 'Invoices',
    path: '/invoices',
    icon: getIcon('material-symbols:payments-outline-sharp'),
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: getIcon('material-symbols:payments-outline-sharp'),
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: getIcon('iconoir:reports'),
  },
];

export default TreasurerNav;
