import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import axios from 'utils/axios';
import { CustomerInfo, Invoices, SendEmails, OtherActions } from './components';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Summary = props => {
  const { className, customer, setCustomer, ...rest } = props;

  const classes = useStyles();

  if (!customer) {
    return null;
  }

  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}>
      <Grid item lg={6} md={6} xl={3} xs={12}>
        <CustomerInfo customer={customer} setCustomer={setCustomer} />
      </Grid>
      <Grid item lg={6} md={6} xl={3} xs={12}>
        <OtherActions totalCost={customer.totalCost} id={customer._id} />
      </Grid>
    </Grid>
  );
};

Summary.propTypes = {
  className: PropTypes.string
};

export default Summary;
