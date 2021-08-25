import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Radio,
  RadioGroup,
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
  OutlinedInput,
  CardActions,
  colors,
  Typography
} from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Page } from 'components';
import { PlusOutlined } from '@ant-design/icons';

import Header from './components/Header';
import { createTrip } from 'actions/tripActions';
import { message, Upload } from 'antd';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  tabs: { marginTop: theme.spacing(3) },
  divider: { backgroundColor: colors.grey[300] },
  content: { marginTop: theme.spacing(3) }
}));

const CreateTrip = props => {
  const { match, history } = props;
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    organizer: false,
    organizerName: '',
    organizerComission: 0,
    youtube: '',
    description: '',
    includes: [],
    excludes: [],
    activeOnSite: true,
    archived: false,
    address: '',
    city: '',
    zipcode: '',
    country: '',
    dayType: 'Weekend',
    tripSize: 'Individual',
    category: 'Multiple Day',

    bedroom: { double: 0, single: 0, twin: 0 },
    interior: { adultPrice: 0, childPrice: 0 },
    exterior: { adultPrice: 0, childPrice: 0 },
    balcony: { adultPrice: 0, childPrice: 0 },
    suite: { adultPrice: 0, childPrice: 0 },

    cabin: {},
    departure: new Date(),
    arrival: new Date(),
    minReservation: 0,
    maxReservation: 0,
    adultPrice: 0,
    childPrice: 0,
    reservationSignal: 0,
    suplimentPrice: 0
  });

  const [cabin, setCabin] = useState({
    interior: { adultPrice: 0, childPrice: 0 },
    exterior: { adultPrice: 0, childPrice: 0 },
    balcony: { adultPrice: 0, childPrice: 0 },
    suite: { adultPrice: 0, childPrice: 0 }
  });

  const [banner, setBanner] = useState('');
  // const [gallery, setGallery] = useState([]);

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };

  const handleBedroomPrice = e => {
    const bedroom = { ...values.bedroom };
    bedroom[e.target.name] = e.target.value;
    setValues({ ...values, ['bedroom']: bedroom });
  };

  const handleCabinPrice = e => {
    const target = e.target.name.split('.');
    let data = { ...values[target[0]] };
    data[target[1]] = e.target.value;
    setValues({ ...values, [target[0]]: data });
  };

  /* Include handler  */
  const handleInclude = (index, e) => {
    const updatedValues = values.includes.map((value, i) => {
      if (i === index) return e.target.value;
      return value;
    });
    setValues({ ...values, ['includes']: updatedValues });
  };
  /* Exclude handler  */
  const handleExclude = (index, e) => {
    const updatedValues = values.excludes.map((value, i) => {
      if (i === index) return e.target.value;
      return value;
    });
    setValues({ ...values, ['excludes']: updatedValues });
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('data', JSON.stringify(values));
    if (banner) {
      formData.append('banner', banner.originFileObj);
    }
    gallery.forEach(element => {
      formData.append('gallery', element.originFileObj);
    });

    createTrip(formData)
      .then(res => {
        setLoading(false);
        message.success('trip created successfully!');
        history.push('/travel/triplist');
      })
      .catch(err => {
        setLoading(false);
        console.log(err.response);
      });
  };

  const [gallery, setGallery] = useState([]);

  return (
    <Page className={classes.root} title="Create New Trip">
      <Header />
      <div className={classes.content}>
        <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          <Card>
            <CardHeader title="Trip Info" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={2} xs={12}>
                  <Card>
                    <CardHeader title="Banner Image" />
                    <Grid
                      item
                      md={12}
                      xs={12}
                      style={{ textAlign: 'center', padding: '15px' }}>
                      <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        onChange={({ fileList }) => setBanner(fileList[0])}>
                        {banner ? null : (
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
                    <CardHeader title="Gallery Image (Allowed Maximum 5 images *)" />
                    <Grid item md={12} xs={12} style={{ padding: '15px' }}>
                      <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={gallery}
                        onChange={({ fileList }) => setGallery(fileList)}
                        maxCount={5}
                        multiple={true}>
                        {gallery.length >= 5 ? null : (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                      </Upload>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Full Address"
                    name="address"
                    onChange={handleChange}
                    value={values.address}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={2} xs={12}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    onChange={handleChange}
                    value={values.city}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={2} xs={12}>
                  <TextField
                    fullWidth
                    label="Zipcode"
                    name="zipcode"
                    onChange={handleChange}
                    value={values.zipcode}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={2} xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    onChange={handleChange}
                    value={values.country}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <ReactQuill
                    value={values.description}
                    theme="snow"
                    placeholder="Project Description"
                    onChange={content => {
                      setValues({ ...values, ['description']: content });
                    }}
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Youtube URL"
                    name="youtube"
                    onChange={handleChange}
                    value={values.youtube}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Card>
                    <CardHeader title="Includes" />
                    <Grid item md={12} style={{ padding: '0 20px 20px' }}>
                      {/* <TextField
                        autoFocus
                        margin="dense"
                        value={includeText}
                        onChange={(e) => setIncludeText(e.target.value)}
                        label="Include 1"
                        fullWidth
                      /> */}
                      {values.includes.map((jump, index) => (
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
                                  onClick={() =>
                                    setValues({
                                      ...values,
                                      ['includes']: values.includes.filter(
                                        j => j !== jump
                                      )
                                    })
                                  }
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Grid item md={2} xs={12}>
                        <Button
                          onClick={() =>
                            setValues({
                              ...values,
                              ['includes']: [...values.includes, '']
                            })
                          }
                          color="primary"
                          variant="contained"
                          sx={{ mt: 1 }}>
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
                      style={{ padding: '0 20px 20px' }}>
                      {/* <TextField
                        autoFocus
                        margin="dense"
                        value={excludeText}
                        onChange={(e) => setExcludeText(e.target.value)}
                        label="Exclude 1"
                        fullWidth
                      /> */}
                      {values.excludes.map((jump, index) => (
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
                                  onClick={() =>
                                    setValues({
                                      ...values,
                                      ['excludes']: values.excludes.filter(
                                        j => j !== jump
                                      )
                                    })
                                  }
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Grid item md={2} xs={12}>
                        <Button
                          onClick={() =>
                            setValues({
                              ...values,
                              ['excludes']: [...values.excludes, '']
                            })
                          }
                          color="primary"
                          variant="contained"
                          sx={{ mt: 1 }}>
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item md={3} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    label="Departure Date"
                    onChange={handleChange}
                    value={values.departure}
                    name="departure"
                    type="date"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    label="Arrival Date"
                    onChange={handleChange}
                    value={values.arrival}
                    name="arrival"
                    type="date"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="Minimum Reservation"
                    name="minReservation"
                    onChange={handleChange}
                    value={values.minReservation}
                    type="number"
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="Maximum Reservation"
                    name="maxReservation"
                    onChange={handleChange}
                    value={values.maxReservation}
                    type="number"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardHeader title="Trip Type" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12} style={{ marginBottom: '20px' }}>
                  <FormControl component="fieldset">
                    {/* <FormLabel component="h1">Trip Day</FormLabel> */}
                    <RadioGroup
                      aria-label="category"
                      name="category"
                      value={values.category}
                      onChange={e =>
                        setValues({ ...values, ['category']: e.target.value })
                      }
                      row>
                      <FormControlLabel
                        value="Single Day"
                        control={<Radio />}
                        label="1 Day Trip"
                      />
                      <FormControlLabel
                        value="Multiple Day"
                        control={<Radio />}
                        label="2 Day or More"
                      />
                      <FormControlLabel
                        value="Cruises"
                        control={<Radio />}
                        label="Cruises"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {values && values.category == 'Single Day' && (
                  <Grid container spacing={3}>
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
                          value={values.reservationSignal}
                          name="reservationSignal"
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
                  </Grid>
                )}

                {values && values.category == 'Multiple Day' && (
                  <Grid container spacing={3}>
                    <Grid item md={4} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Double Bed
                        </InputLabel>
                        <OutlinedInput
                          value={values.bedroom.double}
                          name="double"
                          onChange={handleBedroomPrice}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={85}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Single Bed
                        </InputLabel>
                        <OutlinedInput
                          value={values.bedroom.single}
                          name="single"
                          onChange={handleBedroomPrice}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={85}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Twin Bed
                        </InputLabel>
                        <OutlinedInput
                          value={values.bedroom.twin}
                          name="twin"
                          onChange={handleBedroomPrice}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={105}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                {values && values.category == 'Cruises' && (
                  <Grid container spacing={3}>
                    <Grid container spacing={3} style={{ margin: '0px 30px' }}>
                      <Grid item md={2} xs={2}>
                        <Typography
                          color="textPrimary"
                          gutterBottom
                          variant="h5">
                          Interior Cabin
                        </Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Adult Price</InputLabel>
                          <OutlinedInput
                            value={cabin.interior.adultPrice}
                            name="interior.adultPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Child Price</InputLabel>
                          <OutlinedInput
                            value={cabin.interior.childPrice}
                            name="interior.childPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={2}>
                        <Typography
                          color="textPrimary"
                          gutterBottom
                          variant="h5">
                          Exterior Cabin
                        </Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Adult Price</InputLabel>
                          <OutlinedInput
                            value={cabin.exterior.adultPrice}
                            name="exterior.adultPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Child Price</InputLabel>
                          <OutlinedInput
                            value={cabin.exterior.childPrice}
                            name="exterior.childPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={2}>
                        <Typography
                          color="textPrimary"
                          gutterBottom
                          variant="h5">
                          Balcony Cabin
                        </Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Adult Price</InputLabel>
                          <OutlinedInput
                            value={cabin.balcony.adultPrice}
                            name="balcony.adultPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Child Price</InputLabel>
                          <OutlinedInput
                            value={cabin.balcony.childPrice}
                            name="balcony.childPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={2}>
                        <Typography
                          color="textPrimary"
                          gutterBottom
                          variant="h5">
                          Suite Cabin
                        </Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Adult Price</InputLabel>
                          <OutlinedInput
                            value={cabin.suite.adultPrice}
                            name="suite.adultPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Child Price</InputLabel>
                          <OutlinedInput
                            value={cabin.suite.childPrice}
                            name="suite.childPrice"
                            onChange={handleCabinPrice}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            labelWidth={85}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <CardHeader title="Trip Options" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Grid item md={12} xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="h1">Trip Size</FormLabel>
                      <RadioGroup
                        aria-label="tripSize"
                        name="tripSize"
                        value={values.tripSize}
                        onChange={e =>
                          setValues({ ...values, ['tripSize']: e.target.value })
                        }
                        row>
                        <FormControlLabel
                          value="Individual"
                          control={<Radio />}
                          label="Individual"
                        />
                        <FormControlLabel
                          value="Group"
                          control={<Radio />}
                          label="Group"
                        />
                        <FormControlLabel
                          value="Both"
                          control={<Radio />}
                          label="Both"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item md={8} xs={12}>
                  <Grid item md={12} xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="h1">Trip Day</FormLabel>
                      <RadioGroup
                        aria-label="dayType"
                        name="dayType"
                        value={values.dayType}
                        onChange={e =>
                          setValues({ ...values, ['dayType']: e.target.value })
                        }
                        row>
                        <FormControlLabel
                          value="Weekend"
                          control={<Radio />}
                          label="Weekend"
                        />
                        <FormControlLabel
                          value="Weekday"
                          control={<Radio />}
                          label="Weekday"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
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
                        name="organizer"
                        onChange={e => {
                          setValues({
                            ...values,
                            ['organizer']: e.target.checked
                          });
                        }}
                        color="primary"
                      />
                    }
                    label="Organizer"
                  />
                </Grid>
                {values && values.organizer && (
                  <>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Organizer Name"
                        name="organizerName"
                        onChange={handleChange}
                        value={values.organizerName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Organizer Comission</InputLabel>
                        <OutlinedInput
                          value={values.organizerComission}
                          name="organizerComission"
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          labelWidth={140}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
            <Divider />
            <CardActions style={{ justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}>
                Create Trip
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    </Page>
  );
};

CreateTrip.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default CreateTrip;
