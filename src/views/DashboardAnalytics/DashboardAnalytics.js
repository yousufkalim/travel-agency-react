import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { Page } from 'components';
import {
  Header,
  Overview,
  FinancialStats,
  EarningsSegmentation,
  TopReferrals,
  MostProfitableProducts,
  CustomerActivity,
  LatestOrders
} from './components';
import { Statistics } from 'actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  container: {
    '& > *': {
      height: '100%'
    }
  }
}));

const DashboardAnalytics = () => {
  const classes = useStyles();
  const [data, setData] = useState();

  useEffect(async () => {
    const statistics = await Statistics();
    setData(statistics.data.data);
  }, []);

  return (
    <Page className={classes.root} title="Analytics Dashboard">
      <Header />
      <Grid className={classes.container} container spacing={3}>
        <Grid item xs={12}>
          <Overview data={data?.overviewData} />
        </Grid>
        <Grid item lg={8} xl={9} xs={12}>
          <FinancialStats financialData={data?.financialData} />
        </Grid>
        <Grid item lg={4} xl={3} xs={12}>
          <EarningsSegmentation data={data?.earningSegmentationData} />
        </Grid>
        <Grid item lg={8} xs={12}>
          <LatestOrders orders={data?.latestBookingsData} />
        </Grid>
        <Grid item lg={4} xs={12}>
          <CustomerActivity customers={data?.activeCustomersData} />
        </Grid>
        {/* <Grid item lg={8} xs={12}>
          <MostProfitableProducts />
        </Grid>
        <Grid item lg={4} xs={12}>
          <TopReferrals />
        </Grid> */}
      </Grid>
    </Page>
  );
};

export default DashboardAnalytics;
