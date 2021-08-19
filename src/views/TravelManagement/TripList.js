import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import axios from 'utils/axios';
import { Page, SearchBar } from 'components';
import { Header, Results } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCustomers } from '../../actions';
import { getAgencyTrip } from 'actions/tripActions';

const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(3) },
  results: { marginTop: theme.spacing(3) }
}));

const TripList = () => {
  const classes = useStyles();
  const [tripList, setTripList] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchAllTrip = () => {
      getAgencyTrip().then(({ data }) => {
        if (mounted) {
          setTripList(data.data);
        }
      });
    };

    fetchAllTrip();
    return () => (mounted = false);
  }, []);

  const handleFilter = () => {};
  const handleSearch = e => {};

  return (
    <Page className={classes.root} title="All trip">
      <Header />
      {/* <SearchBar onFilter={handleFilter} onSearch={handleSearch} /> */}
      {tripList && <Results className={classes.results} triplist={tripList} />}
    </Page>
  );
};

export default TripList;
