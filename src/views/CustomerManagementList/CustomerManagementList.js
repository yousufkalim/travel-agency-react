import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import axios from 'utils/axios';
import { Page } from 'components';
import { Header, Results } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCustomers, getCustomerByAgencyId } from '../../actions';

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

  const [customers2, setCustomers2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const { user } = useSelector(state => state.session);
  useEffect(async () => {
    let tempCustomer = await getCustomerByAgencyId(user._id);
    setCustomers2(tempCustomer.data.data);
  }, []);

  // const dispatch = useDispatch();
  // const { customers } = useSelector(state => state.customers);
  // useEffect(() => {
  //   let mounted = true;
  //   dispatch(fetchAllCustomers());

  //   const fetchCustomers = () => {
  //     axios.get('/api/management/customers').then(response => {
  //       console.log(response);
  //       if (mounted) {
  //         setCustomers2(response.data.customers);
  //       }
  //     });
  //   };

  //   fetchCustomers();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  const handleFilter = () => {};
  const handleSearch = e => {};

  return (
    <Page className={classes.root} title="Customer Management List">
      <Header />
      {/* <SearchBar onFilter={handleFilter} onSearch={handleSearch} /> */}
      {customers2 && (
        <Results className={classes.results} customers={customers2} />
      )}
    </Page>
  );
};

export default CustomerManagementList;
