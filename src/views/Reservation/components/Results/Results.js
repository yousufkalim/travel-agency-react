import React, { useState, forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';
import { Button, Link, Typography } from '@material-ui/core';

import { TableEditBar } from 'components';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import moment from 'moment';
import { deleteMultipleBooking } from 'actions';
import { message } from 'antd';

const useStyles = makeStyles(theme => ({
  root: {},
  content: { padding: 0 },
  inner: { minWidth: 700 },
  nameCell: { display: 'flex', alignItems: 'center' },
  avatar: { height: 42, width: 42, marginRight: theme.spacing(1) },
  actions: { padding: theme.spacing(1), justifyContent: 'flex-end' }
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const Results = props => {
  const { className, customers, ...rest } = props;

  const classes = useStyles();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const selectAllCustomer = customers => {
    const selectedCustomers = customers.length
      ? customers.map(customer => customer._id)
      : [];

    setSelectedCustomers(selectedCustomers);
  };

  ////Delete function
  const onDelete = () => {
    // data object with array of trip ids
    const data = {
      ids: selectedCustomers
    };
    // passing data to delete trip function and handling response
    deleteMultipleBooking(data).then(response => {
      if (response.data.message) {
        window.location.reload();
        message.success(response.data.message);
      }
    });
  };

  const tableHeader = [
    {
      title: 'Name',
      field: 'fullName',
      render: customer => (
        <div className={classes.nameCell}>
          <div>
            <Link
              color="inherit"
              component={RouterLink}
              to="/management/customers/1"
              variant="h6">
              {customer.fullName}
            </Link>
            <div>{customer.email}</div>
          </div>
        </div>
      )
    },
    { title: 'Phone', field: 'phone' },
    {
      title: 'Trip name',
      field: 'trip name',
      render: customer => <div>{customer.trip.name}</div>
    },
    { title: 'Status', field: 'status' },
    {
      title: 'Booking Date',
      field: 'bookingDate',
      render: customer => (
        <div>{moment(customer.bookingDate).format('MMMM Do YYYY')}</div>
      )
    },
    {
      title: 'Total Cost',
      field: 'totalCost',
      render: customer => <div>${customer.totalCost}</div>
    },
    {
      title: 'Paid',
      field: 'paid'
    },
    {
      title: 'Actions',
      cellStyle: { textAlign: 'right' },
      headerStyle: { textAlign: 'right' },

      render: customer => (
        <Button
          color="primary"
          component={RouterLink}
          size="small"
          to={`/management/reservation/${customer._id}/summary`}
          variant="outlined">
          View
        </Button>
      ),
      sorting: false
    }
  ];
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Typography color="textSecondary" gutterBottom variant="body2">
        {customers.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(customers.length / rowsPerPage)}
      </Typography>
      <PerfectScrollbar>
        <div className={classes.inner}>
          <MaterialTable
            icons={tableIcons}
            columns={tableHeader}
            data={customers}
            title="All Bookings"
            options={{
              selection: true,
              headerStyle: { backgroundColor: '#fafafa', color: '#000' },
              exportButton: true
            }}
            onSelectionChange={rows => selectAllCustomer(rows)}
          />
        </div>
      </PerfectScrollbar>
      <TableEditBar
        selected={selectedCustomers}
        onMarkPaid={() => console.log(selectedCustomers)}
        onDelete={onDelete}
      />
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

Results.defaultProps = {
  customers: []
};

export default Results;
