// init
import React from 'react';
import { Box, Button, Modal } from '@material-ui/core';

// style for box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

// subscription modal
const NoticeModal = ({ open, setOpen, history, user }) => {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        {/* modal body */}
        <Box sx={style}>
          <h2>Notice</h2>
          <p style={{ fontSize: 16 }}>
            You should add bank before adding trip to receive online payment!
          </p>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
            <Button
              color="textsecondary"
              variant="contained"
              style={{ marginRight: 10 }}
              onClick={() => {
                history.push('/travels/trip/create');
              }}>
              Create Trip
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                user.address.country === 'PT'
                  ? history.push('/travels/trip/addbankpt')
                  : history.push('/travels/trip/addbank');
              }}>
              Add Bank
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default NoticeModal;
