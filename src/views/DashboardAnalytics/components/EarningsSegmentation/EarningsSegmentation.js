import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';

import { GenericMoreButton } from 'components';
import { Chart } from './components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  chartContainer: {
    padding: theme.spacing(3)
  },
  chart: {
    height: 281
  },
  statsContainer: {
    display: 'flex'
  },
  statsItem: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(3, 2),
    '&:not(:last-of-type)': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }
}));

const EarningsSegmentation = props => {
  const { data, className, ...rest } = props;

  const classes = useStyles();
  const [earnings, setEarnings] = useState([]);

  useEffect(async () => {
    setEarnings([
      {
        id: '1',
        label: 'Single Day Trip',
        value: data?.singleDayTripEarning,
        color: '#3f51b5'
      },
      {
        id: '2',
        label: 'Multi Day Trip',
        value: data?.multiDayTripEarning,
        color: '#7986cb'
      },
      {
        id: '3',
        label: 'Cruise Trip Earning',
        value: data?.cruiseTripEarning,
        color: '#c5cae9'
      }
    ]);
  }, [data]);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        action={<GenericMoreButton />}
        title="Earnings Segmentation"
      />
      <Divider />
      <CardContent className={classes.content}>
        <div className={classes.chartContainer}>
          <Chart className={classes.chart} data={earnings} />
        </div>
        <Divider />
        <div className={classes.statsContainer}>
          {earnings.map(earning => (
            <div className={classes.statsItem} key={earning.id}>
              <Typography
                align="center"
                component="h6"
                gutterBottom
                variant="overline">
                {earning.label}
              </Typography>
              <Typography align="center" variant="h4">
                {earning.value}%
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

EarningsSegmentation.propTypes = {
  className: PropTypes.string
};

export default EarningsSegmentation;
