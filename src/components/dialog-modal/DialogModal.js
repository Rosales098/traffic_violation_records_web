import React from 'react';
// material
import { Button, Typography, Dialog, DialogContent, DialogTitle, DialogActions, Box } from '@mui/material';

export const useDialog = () => {
  const [open, setOpen] = React.useState(false);
  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const props = {
    open,
    handleClose,
  };
  return [open, openDialog, props, setOpen, handleClose];
};

const DialogModal = ({
  open,
  handleClose,
  title,
  subtitle,
  children,
  styles,
  width,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    fullWidth
    maxWidth={width || 'sm'}
  >
    <div style={styles?.div}>
      <DialogTitle id="alert-dialog-title" style={styles?.title}>
        {title}
        <br />
        <Typography style={styles?.subtitle}>{subtitle}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box>{children}</Box>
      </DialogContent>

    </div>
  </Dialog>
);

export default DialogModal;
