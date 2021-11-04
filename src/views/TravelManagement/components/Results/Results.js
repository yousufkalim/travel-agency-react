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
import moment from 'moment';

import { deleteTrip } from 'actions/tripActions'; ///delete trip action
import { message } from 'antd'; ////toast messages from antd

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
  const { className, triplist, ...rest } = props;

  const classes = useStyles();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filterValues, setFilterValues] = useState({
    category: '',
    tripSize: '',
    dayType: '',
    minReservation: '',
    maxReservation: '',
    archived: 0,
    date: 'mm/dd/yyyy'
  }); ///state for filter tabs
  const [filteredList, setFilteredList] = useState([]); ///filtered List array
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // useEffect to set filtered list with the current trips list
  useEffect(() => {
    setFilteredList(triplist);
  }, [triplist]);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? triplist.map(customer => customer._id)
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
      field: 'name'
    },
    { title: 'city', field: 'city' },
    { title: 'category', field: 'category' },
    { title: 'size', field: 'tripSize' },
    { title: 'dayType', field: 'dayType' },
    {
      title: 'minReservation',
      field: 'minReservation'
    },
    {
      title: 'maxReservation',
      field: 'maxReservation'
    },
    {
      //// table column for status
      title: 'Status',
      field: 'status'
    },
    {
      title: 'Created',
      field: 'createdAt',
      render: customer => moment(customer.createdAt).format('DD-MMM-YYYY')
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
          to={`/travels/trip/edit/${customer._id}`}
          variant="outlined">
          Edit
        </Button>
      ),
      sorting: false
    }
  ];

  // Filter function
  const onFilter = (value, name) => {
    let tempArray = [];
    if (value !== 'all' && value !== '') {
      tempArray.push(
        ...triplist.filter(item => {
          if (name === 'minReservation' || name === 'maxReservation') {
            // check for min/max reservation
            return item[name] === parseInt(value);
          } else if (name === 'date') {
            // check for date
            return moment(moment(item.createdAt).format('DD-MMM-YYYY')).isSame(
              moment(value).format('DD-MMM-YYYY')
            );
          } else {
            // check for all dropdowns
            return item[name] === value;
          }
        })
      );
      setFilteredList(tempArray);
    } else {
      setFilteredList(triplist);
    }
    setFilterValues({ ...filterValues, [name]: value });
  };

  ////Delete function

  const onDelete = () => {
    // data object with array of trip ids
    const data = {
      ids: selectedCustomers
    };
    // passing data to delete trip function and handling response
    deleteTrip(data).then(response => {
      if (response.data.message) {
        message.success(response.data.message);
        window.location.reload();
      }
    });
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {/* filter tabs state */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
        <select
          name="category"
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
          defaultValue={filterValues.category}
          onChange={e => onFilter(e.target.value, e.target.name)}>
          <option value="" disabled selected>
            Category
          </option>
          <option value="all">All</option>
          <option value="Single Day">Single Day</option>
          <option value="Multiple Day">Multiple Day</option>
          <option value="Cruises">Cruises</option>
        </select>

        <select
          name="tripSize"
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
          defaultValue={filterValues.tripSize}
          onChange={e => onFilter(e.target.value, e.target.name)}>
          <option value="" disabled selected>
            Trip Size
          </option>
          <option value="all">All</option>
          <option value="Individual">Individual</option>
          <option value="Group">Group</option>
          <option value="Both">Both</option>
        </select>

        <select
          name="dayType"
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
          defaultValue={filterValues.dayType}
          onChange={e => onFilter(e.target.value, e.target.name)}>
          <option value="" disabled selected>
            Day Type
          </option>
          <option value="all">All</option>
          <option value="Weekday">Weekday</option>
          <option value="Weekend">Weekend</option>
        </select>

        <input
          type="number"
          name="minReservation"
          placeholder="Min Reservation"
          value={filterValues.minReservation}
          onChange={e => onFilter(e.target.value, e.target.name)}
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
        />

        <input
          type="number"
          name="maxReservation"
          placeholder="Max Reservation"
          value={filterValues.maxReservation}
          onChange={e => onFilter(e.target.value, e.target.name)}
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
        />

        <input
          style={{
            width: 180,
            padding: 10,
            marginBottom: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
          onChange={e => onFilter(e.target.value, e.target.name)}
          placeholder="date"
          name="date"
          type="date"
        />
      </div>

      <Typography color="textSecondary" gutterBottom variant="body2">
        {triplist.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(triplist.length / rowsPerPage)}
      </Typography>
      {/* <Card>
        <CardHeader action={<GenericMoreButton />} title="Trips" />
        <Divider />
        <CardContent className={classes.content}> */}
      <PerfectScrollbar>
        <div className={classes.inner}>
          <MaterialTable
            title={<h2 style={{ marginTop: 10 }}>Trips</h2>}
            icons={tableIcons}
            columns={tableHeader}
            data={filteredList}
            options={{
              selection: true,
              headerStyle: { backgroundColor: '#fafafa', color: '#000' },
              exportButton: true,
              sorting: true
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
      {/*</CardContent>
        <CardActions className={classes.actions}> */}
      {/* <TablePagination
            component="div"
            count={triplist.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          /> */}
      {/* </CardActions>
      </Card> */}
      <TableEditBar
        selected={selectedCustomers}
        onMarkPaid={() => console.log(selectedCustomers)}
        onDelete={onDelete} /// passing trip delete function to edit bar
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
