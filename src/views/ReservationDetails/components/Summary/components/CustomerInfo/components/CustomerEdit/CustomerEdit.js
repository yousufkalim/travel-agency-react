import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Modal,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  TextField,
  Switch,
  Button,
  colors
} from '@material-ui/core';
import { updateCustomer } from 'actions'; ////update customer function
import { message } from 'antd'; ///toast message from antd

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const CustomerEdit = props => {
  const { open, onClose, customer, setCustomer, className, ...rest } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({});

  ////setting customer data to formstates
  useEffect(() => {
    setFormState(customer);
  }, [customer]);

  if (!open) {
    return null;
  }

  const handleFieldChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    }));
  };

  // upating data to db
  const onSave = async () => {
    try {
      const res = await updateCustomer(formState._id, formState);
      res.data.success && message.success('Customer Upadted!');
      setCustomer(formState);
      onClose();
    } catch (error) {
      message.error(error?.response?.data?.error);
    }
  };

  return (
    <Modal onClose={onClose} open={open}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form>
          <CardContent>
            <Typography align="center" gutterBottom variant="h3">
              Edit Customer
            </Typography>
            <Grid className={classes.container} container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={handleFieldChange}
                  value={formState.firstName}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleFieldChange}
                  value={formState.lastName}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email address"
                  name="email"
                  onChange={handleFieldChange}
                  value={formState.email}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Phone number"
                  name="phone"
                  onChange={handleFieldChange}
                  value={formState.phone}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleFieldChange}
                  value={formState.country}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  onChange={handleFieldChange}
                  value={formState.address}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Passport"
                  name="passport"
                  onChange={e => {
                    setFormState(formState => ({
                      ...formState,
                      info: {
                        ...formState.info,
                        passportNo: e.target.value
                      }
                    }));
                  }}
                  value={formState.info?.passportNo}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Nationality"
                  name="nationality"
                  onChange={e => {
                    setFormState(formState => ({
                      ...formState,
                      info: {
                        ...formState.info,
                        nationality: e.target.value
                      }
                    }));
                  }}
                  value={formState.info?.nationality}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="NID"
                  name="nid"
                  onChange={e => {
                    setFormState(formState => ({
                      ...formState,
                      info: {
                        ...formState.info,
                        nid: e.target.value
                      }
                    }));
                  }}
                  value={formState.info?.nid}
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item />
              <Grid item md={6} xs={12}>
                <Typography variant="h5">Email Verified</Typography>
                <Typography variant="body2">
                  Disabling this will automatically send the user a verification
                  email
                </Typography>
                <Switch
                  checked={formState.verified}
                  color="secondary"
                  edge="start"
                  name="verified"
                  onChange={handleFieldChange}
                  value={formState.verified}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography variant="h5">Discounted Prices</Typography>
                <Typography variant="body2">
                  This will give the user discountedprices for all products
                </Typography>
                <Switch
                  checked={formState.discountedPrices}
                  color="secondary"
                  edge="start"
                  name="discountedPrices"
                  onChange={handleFieldChange}
                  value={formState.discountedPrices}
                />
              </Grid> */}
            </Grid>
          </CardContent>
          <CardActions className={classes.actions}>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
            <Button
              className={classes.saveButton}
              onClick={onSave}
              variant="contained">
              Save
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
};

CustomerEdit.displayName = 'CustomerEdit';

CustomerEdit.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

CustomerEdit.defaultProps = {
  open: false,
  onClose: () => {}
};

export default CustomerEdit;
