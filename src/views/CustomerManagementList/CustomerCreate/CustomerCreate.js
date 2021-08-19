import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Typography
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import moment from 'moment';

import { Page } from 'components';
import {
  Header,
  AboutAuthor,
  AboutProject,
  Preferences,
  ProjectCover,
  ProjectDetails
} from './components';
import SuccessSnackbar from 'views/Settings/components/General/components/SuccessSnackbar';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer } from 'actions';

const tagList = ['Hiking', 'Singing'];

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3, 3, 6, 3)
  },
  aboutAuthor: {
    marginTop: theme.spacing(3),
    background: '#fff',
    padding: theme.spacing(3)
  },
  aboutProject: {
    marginTop: theme.spacing(3)
  },
  projectCover: {
    marginTop: theme.spacing(3)
  },
  projectDetails: {
    marginTop: theme.spacing(3)
  },
  preferences: {
    marginTop: theme.spacing(3)
  },
  actions: {
    marginTop: theme.spacing(3)
  }
}));

const CustomerCreate = props => {
  const dispatch = useDispatch();
  const customs = useSelector(state => state.customers);

  const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // const navigate = useNavigate();
  const [input, setInput] = useState({
    type: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
    info: {
      passportNo: '',
      dateIssued: '',
      passportExpire: '',
      nationality: '',
      nid: '',
      maritalStatus: ''
    },
    address: '',
    city: '',
    zipcode: '',
    country: '',
    note: '',
    document: '',
    tags: []
  });

  const handleChange = event => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const handleInfoChange = e => {
    let value = { ...input };
    value['info'][e.target.name] = e.target.value;
    setInput(value);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log(input);

    createCustomer(input)
      .then(res => {
        message.success('New Customer added!');
        props.history.push('/management/customers');
      })
      .catch(({ response }) => {
        console.log(response.data);
        return message.error(response.data.error);
      });
  };

  return (
    <Page className={classes.root} title="Add new customer">
      <Header />
      <div>
        <form
          autoComplete="off"
          noValidate
          onSubmit={handleFormSubmit}
          encType="multipart/form-data">
          <Box sx={{ minHeight: '100%', py: 3 }}>
            <Container maxWidth={false}>
              <Card>
                <CardHeader
                  subheader="Enter the details of the new trip"
                  title="Add New Trip"
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Customer Type</FormLabel>
                        <RadioGroup
                          aria-label="gender"
                          name="gender"
                          value={input.type}
                          onChange={e =>
                            setInput({ ...input, ['type']: e.target.value })
                          }
                          row>
                          <FormControlLabel
                            value="Customer"
                            control={<Radio />}
                            label="Customer"
                          />
                          <FormControlLabel
                            value="Provider"
                            control={<Radio />}
                            label="Provider"
                          />
                          <FormControlLabel
                            value="Affiliate"
                            control={<Radio />}
                            label="Affiliate"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h5">
                        Personal Info
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="First Name"
                        name="firstName"
                        onChange={handleChange}
                        value={input.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        value={input.lastName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Email"
                        name="email"
                        onChange={handleChange}
                        value={input.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Phone"
                        name="phone"
                        onChange={handleChange}
                        value={input.phone}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Birthday"
                        name="birthday"
                        onChange={handleChange}
                        value={moment(input.birthday).format('yyyy-DD-MM')}
                        variant="outlined"
                        type="date"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Address"
                        name="address"
                        onChange={handleChange}
                        value={input.address}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="City"
                        name="city"
                        onChange={handleChange}
                        value={input.city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Zipcode"
                        name="zipcode"
                        onChange={handleChange}
                        value={input.zipcode}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Country"
                        name="country"
                        onChange={handleChange}
                        value={input.country}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={9} xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup
                          name="gender"
                          value={input.gender}
                          onChange={e =>
                            setInput({ ...input, ['gender']: e.target.value })
                          }
                          row>
                          <FormControlLabel
                            value="Male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="Female"
                            control={<Radio />}
                            label="Female"
                          />
                          <FormControlLabel
                            value="Others"
                            control={<Radio />}
                            label="Others"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h5">
                        Details
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Passport No"
                        name="passportNo"
                        onChange={handleInfoChange}
                        value={input.info?.passportNo}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Date Issued"
                        name="dateIssued"
                        onChange={handleInfoChange}
                        value={input.info?.dateIssued}
                        variant="outlined"
                        type="Date"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Passport Expire"
                        name="passportExpire"
                        onChange={handleInfoChange}
                        value={input.info?.passportExpire}
                        variant="outlined"
                        type="Date"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Nationality"
                        name="nationality"
                        onChange={handleInfoChange}
                        value={input.info?.nationality}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="NID"
                        name="nid"
                        onChange={handleInfoChange}
                        value={input.info?.nid}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel>Marital Status</FormLabel>
                        <RadioGroup
                          aria-label="gender"
                          name="maritalStatus"
                          value={input.info?.maritalStatus}
                          onChange={handleInfoChange}
                          row>
                          <FormControlLabel
                            value="Married"
                            control={<Radio />}
                            label="Married"
                          />
                          <FormControlLabel
                            value="UnMarried"
                            control={<Radio />}
                            label="UnMarried"
                          />
                          <FormControlLabel
                            value="N/A"
                            control={<Radio />}
                            label="N/A"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h5">
                        Tags and Note
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Autocomplete
                        onChange={(e, value) =>
                          setInput({ ...input, ['tags']: value })
                        }
                        fullWidth={true}
                        multiple
                        id="combo-box-demo"
                        options={tagList}
                        getOptionLabel={option => option}
                        style={{ width: '100%' }}
                        renderInput={params => (
                          <TextField
                            fullWidth={true}
                            {...params}
                            label="Tags"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <ReactQuill
                        value={input.note}
                        theme="snow"
                        placeholder="Project Presentation"
                        onChange={content => {
                          setInput({ ...input, ['note']: content });
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <Button type="submit" color="primary" variant="contained">
                    Save details
                  </Button>
                </Box>
                <SuccessSnackbar
                  onClose={() => setOpenSnackbar(false)}
                  open={openSnackbar}
                />
              </Card>
            </Container>
          </Box>
        </form>
      </div>
      {/* <AboutAuthor className={classes.aboutAuthor} />
      <AboutProject className={classes.aboutProject} />
      <ProjectCover className={classes.projectCover} />
      <ProjectDetails className={classes.projectDetails} />
      <Preferences className={classes.preferences} />
      <div className={classes.actions}>
        <Button color="primary" variant="contained">
          Create project
        </Button>
      </div> */}
    </Page>
  );
};

export default CustomerCreate;
