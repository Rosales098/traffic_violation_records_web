// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const TreasurerNav = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: getIcon('material-symbols:payments-outline-sharp'),
  },
];

export default TreasurerNav;
