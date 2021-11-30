import React, { useState, forwardRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';

import getInitials from 'utils/getInitials';
import { ReviewStars, GenericMoreButton, TableEditBar } from 'components';

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
import { message } from 'antd'; ////antd toast messages

import { deleteManyCustomer, promotionalEmails } from 'actions'; ////deleteManyCustomer Action
import SendEmailModal from './SendEmailModal';

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
  const [openModal, setOpenModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [mail, setMail] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredList, setFilteredList] = useState([]); ///filtered List array
  const [filterValues, setFilterValues] = useState({
    gender: '',
    type: ''
  }); ///state for filter tabs

  // useEffect to set filtered list with the current trips list
  useEffect(() => {
    setFilteredList(customers);
  }, [customers]);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? customers.map(customer => customer._id)
      : [];

    setSelectedCustomers(selectedCustomers);
  };

  const selectAllCustomer = customers => {
    const selectedCustomers = customers.length
      ? customers.map(customer => customer._id)
      : [];

    setSelectedCustomers(selectedCustomers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomers.indexOf(id);
    let newSelectedCustomers = [];

    if (selectedIndex === -1) {
      newSelectedCustomers = newSelectedCustomers.concat(selectedCustomers, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(1)
      );
    } else if (selectedIndex === selectedCustomers.length - 1) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, selectedIndex),
        selectedCustomers.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomers(newSelectedCustomers);
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value);
  };

  const tableHeader = [
    {
      title: 'Name',
      field: 'firstName',
      render: customer => (
        <div className={classes.nameCell}>
          <Avatar className={classes.avatar} src={customer.avatar}>
            {getInitials(customer.firstName)}
          </Avatar>
          <div>
            <Link
              color="inherit"
              component={RouterLink}
              to="/management/customers/1"
              variant="h6">
              {customer.firstName} {customer.lastName}
            </Link>
            <div>{customer.email}</div>
          </div>
        </div>
      )
    },
    { title: 'Address', field: 'address' },
    { title: 'City', field: 'city' },
    { title: 'Country', field: 'country' },
    { title: 'Gender', field: 'gender' },
    { title: 'Type', field: 'type' },
    {
      title: 'Tags',
      field: 'tags',
      render: customer =>
        customer.tags && customer.tags.map(c => c + '').join(', ')
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
          to={`/management/customers/${customer._id}`}
          variant="outlined">
          View
        </Button>
      ),
      sorting: false
    }
  ];

  const onDelete = () => {
    // data object with array of customer ids
    const data = {
      ids: selectedCustomers
    };
    // passing data to delete many customer function and handling response
    deleteManyCustomer(data).then(response => {
      if (response.data.message) {
        message.success(response.data.message);
        window.location.reload();
      }
    });
  };

  const onModalOpen = () => {
    setOpenModal(true);
  };
  const onModalClose = () => {
    setOpenModal(false);
  };

  const sendEmails = () => {
    // array of emails
    let emails = [];
    selectedCustomers.map(item => {
      customers.map(item2 => {
        item2._id === item && emails.push(item2.email);
      });
    });
    // data object
    const data = {
      emails,
      subject,
      message: mail
    };
    // passing data to send email
    promotionalEmails(data).then(response => {
      if (response.data.message) {
        message.success(response.data.message);
      }
    });
  };

  // Filter function
  const onFilter = (value, name) => {
    let tempArray = [];
    if (value !== 'all' && value !== '') {
      tempArray.push(
        ...customers.filter(item => {
          // check for all dropdowns
          return item[name] === value;
        })
      );
      setFilteredList(tempArray);
    } else {
      setFilteredList(customers);
    }
    setFilterValues({
      gender: name === 'gender' ? value : '',
      type: name === 'type' ? value : ''
    });
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {/* filter fields */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start'
        }}>
        {/* gender filter */}
        <select
          name="gender"
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            marginRight: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
          value={filterValues.gender}
          onChange={e => onFilter(e.target.value, e.target.name)}>
          <option value="" disabled selected>
            Gender
          </option>
          <option value="all">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>

        {/* type filter */}
        <select
          name="type"
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            marginRight: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
          value={filterValues.type}
          onChange={e => onFilter(e.target.value, e.target.name)}>
          <option value="" disabled selected>
            Type
          </option>
          <option value="all">All</option>
          <option value="Customer">Customer</option>
          <option value="Provider">Provider</option>
          <option value="Affiliate">Affiliate</option>
        </select>
      </div>

      <Typography color="textSecondary" gutterBottom variant="body2">
        {customers.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(customers.length / rowsPerPage)}
      </Typography>
      {/* <Card>
        <CardHeader action={<GenericMoreButton />} title="All customers" />
        <Divider />
        <CardContent className={classes.content}> */}
      <PerfectScrollbar>
        <div className={classes.inner}>
          <MaterialTable
            title={<h2 style={{ marginTop: 10 }}>All Customers</h2>}
            icons={tableIcons}
            columns={tableHeader}
            data={filteredList}
            options={{
              // filtering: true,
              // showTitle: false,
              selection: true,
              headerStyle: { backgroundColor: '#fafafa', color: '#000' },
              exportButton: true
            }}
            onSelectionChange={rows => selectAllCustomer(rows)}
          />
          {/* <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.length === customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < customers.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(customer => (
                      <TableRow
                        hover
                        key={customer._id}
                        selected={
                          selectedCustomers.indexOf(customer._id) !== -1
                        }>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedCustomers.indexOf(customer._id) !== -1
                            }
                            color="primary"
                            onChange={event =>
                              handleSelectOne(event, customer._id)
                            }
                            value={
                              selectedCustomers.indexOf(customer._id) !== -1
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className={classes.nameCell}>
                            <Avatar
                              className={classes.avatar}
                              src={customer.avatar}>
                              {getInitials(customer.firstName)}
                            </Avatar>
                            <div>
                              <Link
                                color="inherit"
                                component={RouterLink}
                                to="/management/customers/1"
                                variant="h6">
                                {customer.firstName} {customer.lastName}
                              </Link>
                              <div>{customer.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>{customer.city}</TableCell>
                        <TableCell>{customer.country}</TableCell>
                        <TableCell>{customer.gender}</TableCell>
                        <TableCell>
                          <ReviewStars value={customer.rating} />
                          {customer.tags &&
                            customer.tags.map(c => c + '').join(', ')}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            color="primary"
                            component={RouterLink}
                            size="small"
                            to="/management/customers/1"
                            variant="outlined">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table> */}
        </div>
      </PerfectScrollbar>
      {/* </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={customers.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </CardActions>
      </Card> */}
      <SendEmailModal
        open={openModal}
        handleClose={onModalClose}
        subject={subject}
        setSubject={setSubject}
        mail={mail}
        setMail={setMail}
        onSubmit={sendEmails}
      />
      <TableEditBar
        selected={selectedCustomers}
        onMarkPaid={() => console.log(selectedCustomers)}
        onDelete={onDelete}
        sendEmails={onModalOpen}
        componentName="customer"
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
