import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { financialStats } from 'actions';
import { GenericMoreButton } from 'components';
import { Chart } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  chart: {
    padding: theme.spacing(4, 2, 0, 2),
    height: 400
  }
}));

const FinancialStats = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [data, setData] = useState([]);

  useEffect(async () => {
    const res = await financialStats();
    setData([
      res.data.data.Jan,
      res.data.data.Feb,
      res.data.data.Mar,
      res.data.data.Apr,
      res.data.data.May,
      res.data.data.Jun,
      res.data.data.Jul,
      res.data.data.Aug,
      res.data.data.Sep,
      res.data.data.Oct,
      res.data.data.Nov,
      res.data.data.Dec
    ]);
  }, []);

  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader action={<GenericMoreButton />} title="Financial Stats" />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Chart className={classes.chart} data={data} labels={labels} />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

FinancialStats.propTypes = {
  className: PropTypes.string
};

export default FinancialStats;
