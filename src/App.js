import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// routes
import MainRoute from './routes/MainRoute';
// theme
import ThemeProvider from './theme';
import 'react-toastify/dist/ReactToastify.css';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import store from './store';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ScrollToTop />
        <ToastContainer />
        <BaseOptionChartStyle />
        <MainRoute />
      </ThemeProvider>
    </Provider>
  );
}
