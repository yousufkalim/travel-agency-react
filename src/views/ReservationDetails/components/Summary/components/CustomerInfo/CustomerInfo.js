import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  colors,
  TextField
} from '@material-ui/core';

import { Label } from 'components';
import moment from 'moment';

import { updateStatus, updatePaidStatus } from 'actions';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 0
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const CustomerInfo = props => {
  ///customer and set customer from parent
  const { customer, className, setCustomer, ...rest } = props;
  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Customer info" />
      <Divider />
      <CardContent className={classes.content} style={{ marginBottom: -25 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{customer.email}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Phone</TableCell>
              <TableCell>{customer.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>{customer.address}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Trip Name</TableCell>
              <TableCell>{customer.trip?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Booking Date</TableCell>
              <TableCell>
                {moment(customer.bookingDate).format('MMMM Do YYYY')}
              </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Status</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  name="option"
                  onChange={e => {
                    updateStatus({ status: e.target.value }, customer._id);
                    setCustomer(prev => {
                      prev.status = e.target.value;
                      return { ...prev };
                    });
                  }}
                  select
                  SelectProps={{ native: true }}
                  value={customer.status}
                  variant="outlined">
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rejected">Rejected</option>
                </TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Paid</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  name="option"
                  onChange={e => {
                    updatePaidStatus({ status: e.target.value }, customer._id);
                    setCustomer(prev => {
                      prev.paid = e.target.value;
                      return { ...prev };
                    });
                  }}
                  select
                  SelectProps={{ native: true }}
                  value={customer.paid}
                  variant="outlined">
                  <option value="true">True</option>
                  <option value="false">False</option>
                </TextField>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

CustomerInfo.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired
};

export default CustomerInfo;
