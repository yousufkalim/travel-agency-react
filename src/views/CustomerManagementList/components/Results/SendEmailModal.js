import React from 'react';
import { Box, Button, Modal, TextField, Typography } from '@material-ui/core';

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

// style for box
const TextareaStyle = {
  padding: '10px 12px',
  fontSize: '1rem',
  resize: 'none',
  width: '97%',
  height: '250px',
  marginTop: '15px',
  flex: '1 1',
  font: 'inherit',
  color: 'currentColor',
  border: '1px solid lightgray',
  borderRadius: 4,
  display: 'block',
  minWidth: '0',
  background: 'none',
  boxSizing: 'content-box',
  letterSpacing: 'inherit',
  animationDuration: '10ms'
};

const SendEmailModal = ({
  open,
  handleClose,
  subject,
  setSubject,
  mail,
  setMail,
  onSubmit
}) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        {/* modal body */}
        <Box sx={style}>
          <Typography variant="h4">
            {' '}
            {/* email subject and message */}Send Email
          </Typography>
          <br />
          <form onSubmit={onSubmit}>
            <div>
              {/* email subject and message */}
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                variant="outlined"
                fullWidth
                required={true}
                placeholder="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              <br />
              <textarea
                type="text"
                placeholder="Message"
                style={TextareaStyle}
                required={true}
                value={mail}
                onChange={e => setMail(e.target.value)}
              />
            </div>
            <br />
            {/* create account button */}
            <div style={{ width: '100%', textAlign: 'right' }}>
              <Button variant="contained" color="primary" type="submit">
                Send Email
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default SendEmailModal;
