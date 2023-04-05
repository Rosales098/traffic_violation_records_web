// component
import Iconify from '../../components/Iconify';
import { getLocalStorageItem } from '../../utils/getLocalStorage';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
const userData = getLocalStorageItem("userData");

const TreasurerNav = [
  {
    title: 'Invoices',
    path: '/invoices',
    icon: getIcon('material-symbols:payments-outline-sharp'),
  },
  {
    title: 'Payments',
    path: `/payments/${userData.id}`,
    icon: getIcon('material-symbols:payments-outline-sharp'),
  },
  {
    title: 'Reports',
    path: `/reports/${userData.id}`,
    icon: getIcon('iconoir:reports'),
  },
];

export default TreasurerNav;
