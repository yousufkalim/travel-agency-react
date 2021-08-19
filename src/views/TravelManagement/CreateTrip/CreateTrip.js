import React, { useState } from 'react';
import Cookies from 'js-cookie';
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
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';
import { notification, Upload, Modal } from 'antd';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { PlusOutlined } from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Page } from 'components';
import {
  Header,
  AboutAuthor,
  AboutProject,
  Preferences,
  ProjectCover,
  ProjectDetails
} from './components';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3, 3, 6, 3)
  },
  aboutAuthor: {
    marginTop: theme.spacing(3),
    background: '#fff'
    // padding: theme.spacing(3)
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

const category = [
  {
    value: 'HoneyMoon',
    label: 'HoneyMoon'
  },
  {
    value: 'Expedions',
    label: 'Expedions'
  },
  {
    value: 'Beaches',
    label: 'Beaches'
  },
  {
    value: 'Big-Trips',
    label: 'Big Trips'
  }
];
const typesOfTour = [
  {
    value: 'SingleDayTour',
    label: '1 Day tours'
  },
  {
    value: 'TwoDayOrMore',
    label: '2 day tour or more'
  },
  {
    value: 'Cruises',
    label: 'Cruises'
  }
];
const tripSize = [
  {
    value: 'Individual',
    label: 'Individual'
  },
  {
    value: 'Group',
    label: 'Group'
  },
  {
    value: 'Both',
    label: 'Both'
  }
];

const CreateTrip = props => {
  const classes = useStyles();

  const [values, setValues] = useState({
    title: '',
    presentation: '',
    url1: '',
    url2: '',
    url3: '',
    description: '',
    includes: [],
    excludes: [],
    activeOnSite: false,
    spotlight: false,
    affiliates: false,
    archived: false,
    soldOf: false,
    stamp: false,
    sealText: '',
    city: '',
    address: '',
    category: 'HoneyMoon',
    tripSize: 'Individual',
    tourType: 'SingleDayTour',
    departureDate: '',
    arrivalDate: '',
    minBooking: 0,
    maxBooking: 0,
    adultPrice: 0,
    childPrice: 0,
    reservSignal: 0,
    suplimentPrice: 0
  });

  const [bannerImage, setBannerImage] = useState('');
  const [gallery, setGallery] = useState([]);

  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [includes, setIncludes] = useState(['']);
  const handleInclude = (index, e) => {
    const updatedValues = includes.map((value, i) => {
      if (i === index) return e.target.value;
      return value;
    });
    setIncludes(updatedValues);
  };
  const deleteIncludesValue = jump => {
    setIncludes(includes.filter(j => j !== jump));
  };

  const addMoreInclude = () => {
    setIncludes([...includes, '']);
  };

  /* Exclude hadnler  */
  const [excludes, setExcludes] = useState(['']);
  const handleExclude = (index, e) => {
    const updatedValues = excludes.map((value, i) => {
      if (i === index) return e.target.value;
      return value;
    });
    setExcludes(updatedValues);
  };
  const deleteExcludesValue = jump => {
    setExcludes(excludes.filter(j => j !== jump));
  };

  const addMoreExclude = () => {
    setExcludes([...excludes, '']);
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    setValues({ ...values, ['excludes']: excludes, ['includes']: includes });

    const formData = new FormData();
    console.log(values);
    formData.append('data', JSON.stringify(values));

    if (bannerImage) {
      formData.append('bannerImage', bannerImage.originFileObj);
    }
    gallery.forEach(element => {
      formData.append('gallery', element.originFileObj);
    });

    // apiServices
    //   .addTrip(formData)
    //   .then(res => {
    //     console.log(res);
    //     openNotification(
    //       'success',
    //       'Trip Created',
    //       'New trip has been created successfully'
    //     );
    //   })
    //   .catch(err => console.log(err.response));
  };

  const openNotification = (type, title, msg) => {
    notification[type]({
      message: title,
      description: msg,
      onClick: () => {
        console.log('Notification Clicked!');
      }
    });
  };

  return (
    <Page className={classes.root} title="Add new customer">
      <Header />

      <div className={classes.aboutAuthor}>
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
                    <Grid item md={12} xs={12}>
                      <TextField
                        autoFocus
                        fullWidth
                        helperText="Please specify trip name/title here"
                        label="Trip Name"
                        name="title"
                        onChange={handleChange}
                        value={values.title}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        onChange={handleChange}
                        value={values.city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={9} xs={12}>
                      <TextField
                        fullWidth
                        label="Full Address"
                        name="address"
                        onChange={handleChange}
                        value={values.address}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      {/* <TextField
                    fullWidth
                    label="Trip Presentation"
                    value={values.presentation}
                    onChange={handleChange}
                    name="presentation"
                    multiline
                    rows={5}
                    variant="outlined"
                  /> */}
                      <ReactQuill
                        value={values.presentation}
                        theme="snow"
                        placeholder="Project Presentation"
                        onChange={content => {
                          setValues({ ...values, ['presentation']: content });
                        }}
                      />
                    </Grid>

                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label="Youtube URL"
                        name="url1"
                        onChange={handleChange}
                        value={values.url1}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label="Youtube URL"
                        name="url2"
                        onChange={handleChange}
                        value={values.url2}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label="Youtube URL"
                        name="url3"
                        onChange={handleChange}
                        value={values.url3}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      {/* <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Description of the day to day trip"
                    value={values.description}
                    onChange={handleChange}
                    name="description"
                    multiline
                    rows={5}
                    variant="outlined"
                  /> */}

                      <ReactQuill
                        value={values.description}
                        theme="snow"
                        placeholder="Project Description"
                        onChange={content => {
                          setValues({ ...values, ['description']: content });
                        }}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <Card>
                        <CardHeader title="Includes" />
                        <Grid
                          item
                          md={12}
                          style={{ padding: '0px 20px 20px 20px' }}>
                          {includes.map((jump, index) => (
                            <Box key={jump}>
                              <Grid container spacing={1} alignItems="flex-end">
                                <Grid item xs={11}>
                                  <TextField
                                    autoFocus
                                    margin="normal"
                                    label={`Include ${index + 1}`}
                                    value={jump || ''}
                                    onChange={e => handleInclude(index, e)}
                                    variant="outlined"
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={1}>
                                  <IconButton aria-label="delete">
                                    <DeleteIcon
                                      onClick={() => deleteIncludesValue(jump)}
                                    />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                          <Grid item md={2} xs={12}>
                            <Button
                              onClick={addMoreInclude}
                              color="primary"
                              variant="contained">
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <Card>
                        <CardHeader title="Excludes" />
                        <Grid
                          item
                          md={12}
                          xs={12}
                          style={{ padding: '0px 20px 20px 20px' }}>
                          {excludes.map((jump, index) => (
                            <Box key={jump}>
                              <Grid container spacing={1} alignItems="flex-end">
                                <Grid item xs={11}>
                                  <TextField
                                    autoFocus
                                    margin="normal"
                                    label={`Exclude ${index + 1}`}
                                    value={jump || ''}
                                    onChange={e => handleExclude(index, e)}
                                    variant="outlined"
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={1}>
                                  <IconButton aria-label="delete">
                                    <DeleteIcon
                                      onClick={() => deleteExcludesValue(jump)}
                                    />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                          <Grid item md={2} xs={12}>
                            <Button
                              onClick={addMoreExclude}
                              color="primary"
                              variant="contained"
                              sx={{ mt: 1 }}>
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="activeOnSite"
                            color="primary"
                            onChange={e => {
                              setValues({
                                ...values,
                                [e.target.name]: e.target.checked
                              });
                            }}
                          />
                        }
                        label="Active on site"
                      />
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="spotlight"
                            onChange={e => {
                              setValues({
                                ...values,
                                [e.target.name]: e.target.checked
                              });
                            }}
                            color="primary"
                          />
                        }
                        label="Spotlight"
                      />
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="affiliates"
                            onChange={e => {
                              setValues({
                                ...values,
                                [e.target.name]: e.target.checked
                              });
                            }}
                            color="primary"
                          />
                        }
                        label="Affiliates"
                      />
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="archived"
                            onChange={e => {
                              setValues({
                                ...values,
                                [e.target.name]: e.target.checked
                              });
                            }}
                            color="primary"
                          />
                        }
                        label="Archived"
                      />
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="stamp"
                            onChange={e => {
                              setValues({
                                ...values,
                                [e.target.name]: e.target.checked
                              });
                            }}
                            color="primary"
                          />
                        }
                        label="Stamp"
                      />
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="soldOf"
                            onChange={e => {
                              setValues({
                                ...values,
                                [e.target.name]: e.target.checked
                              });
                            }}
                            color="primary"
                          />
                        }
                        label="Sold of"
                      />
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Seal Text"
                        name="sealText"
                        onChange={handleChange}
                        value={values.sealText}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Category"
                        name="category"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined">
                        {category.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Individual or Group"
                        name="tripSize"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined">
                        {tripSize.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Types of tour"
                        name="tourType"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined">
                        {typesOfTour.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Departure Date"
                        onChange={handleChange}
                        name="departureDate"
                        type="date"
                        fullWidth
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Arrival Date"
                        onChange={handleChange}
                        name="arrivalDate"
                        type="date"
                        fullWidth
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Minimum Booking"
                        name="minBooking"
                        onChange={handleChange}
                        type="number"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Maximum Booking"
                        name="maxBooking"
                        onChange={handleChange}
                        type="number"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Adult Price
                        </InputLabel>
                        <OutlinedInput
                          value={values.adultPrice}
                          name="adultPrice"
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={85}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Child Price
                        </InputLabel>
                        <OutlinedInput
                          value={values.childPrice}
                          name="childPrice"
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={85}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Reserve Signal
                        </InputLabel>
                        <OutlinedInput
                          value={values.reservSignal}
                          name="reservSignal"
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={105}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Individual Supliment Price
                        </InputLabel>
                        <OutlinedInput
                          value={values.suplimentPrice}
                          name="suplimentPrice"
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={190}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <Card>
                        <CardHeader title="Banner Image" />
                        <Grid item md={12} xs={12} style={{ padding: '20px' }}>
                          <Upload
                            url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            onChange={({ fileList }) =>
                              setBannerImage(fileList[0])
                            }
                            status="success">
                            {bannerImage ? null : (
                              <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                              </div>
                            )}
                          </Upload>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid item md={10} xs={12}>
                      <Card>
                        <CardHeader title="Gallery Image (Allowed Maximum 10 images *)" />
                        <Grid item md={12} xs={12} style={{ padding: '20px' }}>
                          <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={gallery}
                            onChange={({ fileList }) => setGallery(fileList)}
                            multiple={true}>
                            {gallery.length >= 10 ? null : (
                              <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                              </div>
                            )}
                          </Upload>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <Button type="submit" color="primary" variant="contained">
                    Save details
                  </Button>
                </Box>
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

export default CreateTrip;
