import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Box from '@material-ui/core/Box';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import moment from 'moment';
import { toast } from 'react-toastify';
import { addAgencyBank } from 'actions/tripActions';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useSelector } from 'react-redux';

const steps = ['Person Details', 'Company Details', 'Bank Details'];

const useStyles = makeStyles({
  form: {
    marginTop: '15px',
    maxWidth: '100%'
  },
  imgDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '10px'
  },
  submitBtn: {
    marginTop: '10px',
    marginBottom: '10px',
    width: '100%'
  },
  textField: {
    width: '100%',
    marginBottom: '20px',
    color: 'red'
  },
  phoneStyle: {
    '& .MuiInputBase-input': {
      marginLeft: '27px'
    }
  }
});

let ppi = '';
let token = '';
let personToken = '';

const AddBank = () => {
  const classes = useStyles();
  const stripe = useStripe();
  const { user } = useSelector(state => state.session);

  const [activeStep, setActiveStep] = useState(0);

  // states for person data
  const [personDetails, setpersonDetails] = useState({
    firstName: '',
    lastName: '',
    dob: '2000-01-01',
    CPF: '',
    lineAddress: '',
    postalCode: '',
    city: '',
    state: '',
    title: '',
    director: true,
    owner: false,
    executive: true,
    ownershipPercentage: ''
  });
  const [phone, setPhone] = useState();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const [companyDetails, setcompanyDetails] = useState({
    name: '',
    taxid: '',
    lineAddress: '',
    postalCode: '',
    city: '',
    state: ''
  });
  const [companyPhone, setCompanyPhone] = useState();

  // Bank Details
  const [bankDetails, setbankDetails] = useState({
    name: '',
    accountNumber: '',
    routingNumber: ''
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    activeStep !== 0 && setActiveStep(activeStep - 1);
  };

  const getToken = async () => {
    // Retrieving front and back documentation ids//
    const frontData = new FormData();
    frontData.append('file', front);
    frontData.append('purpose', 'identity_document');
    const frontfileResult = await fetch('https://uploads.stripe.com/v1/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPEPK}` },
      body: frontData
    });
    const backData = new FormData();

    backData.append('file', back);
    backData.append('purpose', 'identity_document');

    const backfileResult = await fetch('https://uploads.stripe.com/v1/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPEPK}` },
      body: frontData
    });

    const frontfileData = await frontfileResult.json();
    const backfileData = await backfileResult.json();

    let pError = await getPersonToken(frontfileData, backfileData);
    let aError = await getAccountToken(frontfileData, backfileData);

    let errors = [];
    if (pError) {
      errors.push(pError);
    }
    if (aError) {
      errors.push(aError);
    }
    return errors;
  };

  const getPersonToken = async (frontfileData, backfileData) => {
    try {
      // Creating person token//
      let day = moment(personDetails.dob).format('D');
      let month = moment(personDetails.dob).format('M');
      let year = moment(personDetails.dob).format('Y');

      let data = {
        person: {
          id_number: ppi,
          first_name: personDetails.firstName,
          last_name: personDetails.lastName,
          address: {
            line1: personDetails.lineAddress,
            postal_code: personDetails.postalCode,
            city: personDetails.city,
            state: personDetails.state
          },
          political_exposure: 'none',
          relationship: {
            director: personDetails.director,
            executive: personDetails.executive,
            owner: personDetails.owner,
            representative: true,
            title: personDetails.title,
            percent_ownership: personDetails.ownershipPercentage
              ? parseInt(personDetails.ownershipPercentage)
              : 0
          },
          dob: {
            day: day,
            month: month,
            year: year
          },
          phone: phone, /////55 upro 10 digits
          email: user.email,
          verification: {
            document: {
              front: frontfileData.id,
              back: backfileData.id
            },
            additional_document: {
              front: frontfileData.id,
              back: backfileData.id
            }
          }
        }
      };
      const personResult = await stripe.createToken('person', data);

      if (personResult.error) {
        return personResult.error.message;
      } else {
        personToken = personResult;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAccountToken = async (frontfileData, backfileData) => {
    try {
      //Creating account token//
      const accountResult = await stripe.createToken('account', {
        business_type: 'company',
        company: {
          name: companyDetails.name,
          address: {
            line1: companyDetails.lineAddress,
            postal_code: companyDetails.postalCode,
            city: companyDetails.city,
            state: companyDetails.state
          },
          phone: companyPhone,
          tax_id: companyDetails.taxid, ////CNPJ 14 digits
          directors_provided: true,
          executives_provided: true,
          owners_provided: true,
          verification: {
            document: {
              front: frontfileData.id,
              back: backfileData.id
            }
          }
        },
        tos_shown_and_accepted: true
      });
      if (accountResult.error) {
        return accountResult.error.message;
      } else {
        token = accountResult;
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getPPI = async () => {
    try {
      //Creating account token//
      await stripe
        .createToken('pii', {
          personal_id_number: personDetails.CPF
        })
        .then(function(result) {
          ppi = result.token.id;
        });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await getPPI();
      let err = await getToken();
      if (err && err.length != 0) {
        toast.error(err[0]);
        return;
      }
      await addAgency();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addAgency = async () => {
    try {
      let data = {
        token,
        personToken,
        user,
        name: companyDetails.name,
        accountNumber: bankDetails.accountNumber,
        routingNumber: bankDetails.routingNumber,
        bankName: bankDetails.name
      };
      await addAgencyBank(data);
      toast.success('Success');
    } catch (error) {
      if ({ ...error }) {
        toast.error({ ...error }.response.data.message);
      } else {
        console.log(error);
      }
    }
  };

  const setImages = e => {
    const { name, files } = e.target;
    if (name === 'front') {
      setFront(files[0]);
    } else if (name === 'back') {
      setBack(files[0]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50%'
        }}>
        <Box sx={{ width: '100%', backgroundColor: 'white', padding: 25 }}>
          <Typography
            variant="h6"
            style={{ display: 'flex', justifyContent: 'center' }}>
            <b>Connect Your Bank Account</b>
          </Typography>

          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel
                    StepIconProps={{ sx: { color: 'red' } }}
                    {...labelProps}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography
                sx={{ mt: 2, mb: 1 }}
                style={{ display: 'flex', justifyContent: 'center' }}>
                Your account has been connected.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 ? (
                <div className={classes.form}>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="First Name"
                        name="firstName"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.firstName = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Last Name"
                        name="lastName"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.lastName = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.lastName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        label="Date of Birth"
                        name="dob"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.dob = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.dob}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="CPF"
                        name="cpf"
                        type="number"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.CPF = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.CPF}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <PhoneInput
                        international
                        limitMaxLength
                        countryCallingCodeEditable={false}
                        value={phone}
                        onChange={setPhone}
                        defaultCountry="BR"
                        countries={['BR']}
                        numberInputProps={{
                          style: {
                            flex: '1 1',
                            minWidth: 0,
                            font: 'inherit',
                            color: 'currentColor',
                            width: '100%',
                            border: '1px solid lightgray',
                            borderRadius: 4,
                            height: '2.3rem',
                            margin: 0,
                            display: 'block',
                            padding: '6px 0 7px',
                            minWidth: '0',
                            background: 'none',
                            boxSizing: 'content-box',
                            letterSpacing: 'inherit',
                            animationDuration: '10ms'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Title in Company"
                        name="city"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.title = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.title}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h5">
                        Address
                      </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Line Address"
                        name="line"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.lineAddress = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.lineAddress}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="City"
                        name="city"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.city = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="State"
                        name="state"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.state = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.state}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Postal Code"
                        name="postalcode"
                        type="number"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.postalCode = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={personDetails.postalCode}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={personDetails.owner}
                            onChange={e => {
                              setpersonDetails(prev => {
                                prev.owner = e.target.checked;
                                return { ...prev };
                              });
                            }}
                          />
                        }
                        label="Owner"
                      />
                    </Grid>
                    {personDetails.owner && (
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          label="Ownership Percentage"
                          name="percentage"
                          type="number"
                          onChange={e => {
                            setpersonDetails(prev => {
                              prev.ownershipPercentage = e.target.value;
                              return { ...prev };
                            });
                          }}
                          value={personDetails.ownershipPercentage}
                          variant="outlined"
                        />
                      </Grid>
                    )}
                    <Grid item md={12} xs={12}>
                      <div className={classes.imgDiv}>
                        <div>
                          <label
                            htmlFor="front"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'flex-start'
                            }}>
                            <input
                              style={{ display: 'none' }}
                              id="front"
                              name="front"
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={e => setImages(e)}
                            />
                            <Button
                              variant="contained"
                              component="span"
                              color="secondary"
                              style={{ fontSize: '10px' }}>
                              Front Side
                            </Button>
                            <div
                              style={{
                                fontSize: '14px'
                              }}>
                              {front.name}
                            </div>
                          </label>
                        </div>

                        <div>
                          <label
                            htmlFor="back"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'flex-end'
                            }}>
                            <input
                              style={{ display: 'none' }}
                              id="back"
                              name="back"
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={e => setImages(e)}
                            />

                            <Button
                              variant="contained"
                              component="span"
                              color="secondary"
                              style={{ fontSize: '10px' }}>
                              Back Side
                            </Button>
                            <div
                              style={{
                                fontSize: '12px'
                              }}>
                              {back.name}
                            </div>
                          </label>
                        </div>
                      </div>
                    </Grid>
                    <br />
                    <div
                      style={{
                        color: '#f44336',
                        fontSize: '14px',
                        textAlign: 'center',
                        width: '100%',
                        marginTop: -15
                      }}>
                      Provide Your Identification Card Front And Back
                    </div>
                  </Grid>
                </div>
              ) : activeStep === 1 ? (
                <div className={classes.form}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Company Name"
                        name="name"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.name = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={companyDetails.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <PhoneInput
                        international
                        limitMaxLength
                        countryCallingCodeEditable={false}
                        value={companyPhone}
                        onChange={setCompanyPhone}
                        defaultCountry="BR"
                        countries={['BR']}
                        numberInputProps={{
                          style: {
                            flex: '1 1',
                            minWidth: 0,
                            font: 'inherit',
                            color: 'currentColor',
                            width: '100%',
                            border: '1px solid lightgray',
                            borderRadius: 4,
                            height: '2.3rem',
                            margin: 0,
                            display: 'block',
                            padding: '6px 0 7px',
                            minWidth: '0',
                            background: 'none',
                            boxSizing: 'content-box',
                            letterSpacing: 'inherit',
                            animationDuration: '10ms'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Tax ID"
                        name="taxId"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.taxid = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={companyDetails.taxid}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h5">
                        Address
                      </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Line Address"
                        name="line"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.lineAddress = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={companyDetails.lineAddress}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="City"
                        name="city"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.city = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={companyDetails.city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="State"
                        name="state"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.state = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={companyDetails.state}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Postal Code"
                        name="postalcode"
                        type="number"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.postalCode = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={companyDetails.postalCode}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </div>
              ) : (
                <div className={classes.form}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Bank Name"
                        name="name"
                        onChange={e => {
                          setbankDetails(prev => {
                            prev.name = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={bankDetails.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Account Number"
                        name="accountNumber"
                        onChange={e => {
                          setbankDetails(prev => {
                            prev.accountNumber = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={bankDetails.accountNumber}
                        variant="outlined"
                        type="number"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Routing Number"
                        name="routingNumber"
                        type="number"
                        onChange={e => {
                          setbankDetails(prev => {
                            prev.routingNumber = e.target.value;
                            return { ...prev };
                          });
                        }}
                        value={bankDetails.routingNumber}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </div>
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  pt: 2
                }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}>
                    Back
                  </Button>
                  <Button
                    onClick={
                      activeStep === steps.length - 1
                        ? handleSubmit
                        : handleNext
                    }
                    // disabled={disable}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </div>
    </div>
  );
};

export default AddBank;
