// init
import React from 'react';
import { Box, Button, Modal } from '@material-ui/core';
import BeginnerPlan from './BeginnerPlan';
import ProfessionalPlan from './ProfessionalPlan';

// style for box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

// subscription modal
const SubscriptionModal = ({
  open,
  setOpen,
  selected,
  setSelected,
  subscription,
  onCreateAccount
}) => {
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* beginner and professional plan */}
            <BeginnerPlan
              selected={selected}
              setSelected={setSelected}
              subscription={subscription && subscription[0]}
            />
            <ProfessionalPlan
              selected={selected}
              setSelected={setSelected}
              subscription={subscription && subscription[1]}
            />
          </div>
          <br />
          {/* create account button */}
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onCreateAccount()}>
              Create Account
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SubscriptionModal;
