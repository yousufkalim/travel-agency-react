import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { Header, Results } from './components';
import { getAllBooking } from 'actions/bookingAction';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const CustomerManagementList = () => {
  const classes = useStyles();
  const [booking, setBooking] = useState([]);

  useEffect(async () => {
    let tempBooking = await getAllBooking();
    setBooking(tempBooking.data.data);
  }, []);

  return (
    <Page className={classes.root} title="Customer Management List">
      <Header />
      {booking && <Results className={classes.results} customers={booking} />}
    </Page>
  );
};

export default CustomerManagementList;
