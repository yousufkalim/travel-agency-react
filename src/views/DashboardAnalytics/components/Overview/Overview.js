import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography, Grid, colors } from '@material-ui/core';
import { Statistics } from 'actions';
import { Label } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  item: {
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  valueContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginLeft: theme.spacing(1)
  }
}));

const Overview = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [data, setData] = useState({
    NoOfBookings: '',
    NoOfCustomers: '',
    NoOfTrips: '',
    totalIncome: ''
  });

  useEffect(async () => {
    const statistics = await Statistics();
    setData(statistics.data.data);
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="center" container justify="space-between">
        <Grid className={classes.item} item md={3} sm={6} xs={12}>
          <Typography component="h2" gutterBottom variant="overline">
            Total Income
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">${data.totalIncome}</Typography>
          </div>
        </Grid>
        <Grid className={classes.item} item md={3} sm={6} xs={12}>
          <Typography component="h2" gutterBottom variant="overline">
            Total No Of Trips
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">{data.NoOfTrips}</Typography>
          </div>
        </Grid>
        <Grid className={classes.item} item md={3} sm={6} xs={12}>
          <Typography component="h2" gutterBottom variant="overline">
            Total No oF Customers
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">{data.NoOfCustomers}</Typography>
          </div>
        </Grid>
        <Grid className={classes.item} item md={3} sm={6} xs={12}>
          <Typography component="h2" gutterBottom variant="overline">
            Total No oF Bookings
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">{data.NoOfBookings}</Typography>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

Overview.propTypes = {
  className: PropTypes.string
};

export default Overview;
