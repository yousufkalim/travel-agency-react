import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Tabs, Tab, Divider, colors } from '@material-ui/core';
import { fetchCustomer } from 'actions/customerActions';
import { Page } from 'components';
import { Header, Summary, Invoices, Logs } from './components';
import { useParams, useHistory } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  tabs: {
    marginTop: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const CustomerManagementDetails = props => {
  const params = useParams(); ////to get id from params
  const history = useHistory(); ////for routing
  const classes = useStyles();
  const { id, tab } = params;
  const [customer, setCustomer] = useState({});

  ///useEfftct to get customer from db
  useEffect(() => {
    getCustomer();
  }, []);

  ////getting customer from db and setting in state
  const getCustomer = async () => {
    let temp = await fetchCustomer(id);
    setCustomer(temp.data.customer);
  };

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  ////invoices and logs are not required for now
  const tabs = [
    { value: 'summary', label: 'Summary' }
    // { value: 'invoices', label: 'Invoices' },
    // { value: 'logs', label: 'Logs' }
  ];

  if (!tab) {
    return <Redirect to={`/management/customers/${id}/summary`} />;
  }

  if (!tabs.find(t => t.value === tab)) {
    return <Redirect to="/errors/error-404" />;
  }

  return (
    <Page className={classes.root} title="Customer Management Details">
      {/* passing customer name to header */}
      <Header customerName={`${customer.firstName} ${customer.lastName}`} />
      <Tabs
        className={classes.tabs}
        onChange={handleTabsChange}
        scrollButtons="auto"
        value={tab}
        variant="scrollable">
        {tabs.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider className={classes.divider} />
      <div className={classes.content}>
        {/* passing customer to summary component */}
        {tab === 'summary' && (
          <Summary customer={customer} setCustomer={setCustomer} />
        )}
        {/* {tab === 'invoices' && <Invoices />}
        {tab === 'logs' && <Logs />} */}
      </div>
    </Page>
  );
};

CustomerManagementDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default CustomerManagementDetails;
