import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import { getLocalStorageItem } from '../../utils/getLocalStorage';
// mocks_
import UserApi from '../../service/UserApi';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '#',
  },
];
const adminAvatar = '/static/mock-images/avatars/admin.png';
const treasurerAvatar = '/static/mock-images/avatars/cfo.png';
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const queryClient = useQueryClient();
  const { logout } = UserApi;

  const userData = getLocalStorageItem('userData');

  const { mutate: logOut, isLoading: logOutLoading } = useMutation(() => logout(), {
    onSettled: () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      queryClient.clear();
      navigate('/signin', { replace: true });
    },
  });

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={userData?.role === 'admin' ? adminAvatar : treasurerAvatar} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {`${userData?.first_name?.charAt(0)?.toUpperCase() + userData?.first_name?.slice(1)}
              ${userData?.middle_name?.charAt(0)?.toUpperCase()}.
              ${userData?.last_name?.charAt(0)?.toUpperCase() + userData?.last_name?.slice(1)}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => logOut()} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
