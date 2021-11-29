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
import validate from 'validate.js';

const steps = ['Person Details', 'Company Details', 'Bank Details'];
//Schema of the form
const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32,
      minimum: 3
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32,
      minimum: 3
    }
  },

  cpf: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 11,
      minimum: 11
    }
  },
  title: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  line: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  city: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  state: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  postalcode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 8,
      minimum: 8
    }
  },

  percentage: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 2,
      minimum: 1
    }
  },
  CompanyName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  taxId: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 14,
      minimum: 14
    }
  },
  CompanyLineAddress: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  CompanyCity: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  CompanyState: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  CompanyPostalcode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 8,
      minimum: 8
    }
  },
  bankname: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  },
  accountNumber: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 7,
      minimum: 7
    }
  },
  routingNumber: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 7,
      minimum: 7
    }
  }
};

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
  //state for validation
  const [formState, setFormState] = useState({
    isValid: false,
    errors: {},
    touched: {},
    values: {},
    age: {}
  });
  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);
  //State for Date Error
  const [DateError, setDateError] = useState('');

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
  //for handling error in fields
  const handleError = event => {
    event.persist();
    //will set the form state
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
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
  // hasError shows the error of the fields
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

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
                        error={hasError('firstName')}
                        helperText={
                          hasError('firstName')
                            ? formState.errors.firstName[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="First Name"
                        name="firstName"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.firstName = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={personDetails.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('lastName')}
                        helperText={
                          hasError('lastName')
                            ? formState.errors.lastName[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Last Name"
                        name="lastName"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.lastName = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={personDetails.lastName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={DateError}
                        helperText={DateError}
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
                          let diff = moment().diff(
                            e.target.value,
                            'years',
                            false
                          );
                          //condition for checkin if the user is older than 13years
                          if (diff <= 13) {
                            setDateError(
                              'You need to be at least 13 years old'
                            );
                          }
                        }}
                        value={personDetails.dob}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('cpf')}
                        helperText={
                          hasError('cpf') ? formState.errors.cpf[0] : null
                        }
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
                          handleError(e);
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
                        error={hasError('title')}
                        helperText={
                          hasError('title') ? formState.errors.title[0] : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Title in Company"
                        name="title"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.title = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
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
                        error={hasError('line')}
                        helperText={
                          hasError('line') ? formState.errors.line[0] : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Line Address"
                        name="line"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.lineAddress = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={personDetails.lineAddress}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('city')}
                        helperText={
                          hasError('city') ? formState.errors.city[0] : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="City"
                        name="city"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.city = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={personDetails.city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('state')}
                        helperText={
                          hasError('state') ? formState.errors.state[0] : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="State"
                        name="state"
                        onChange={e => {
                          setpersonDetails(prev => {
                            prev.state = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={personDetails.state}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('postalcode')}
                        helperText={
                          hasError('postalcode')
                            ? formState.errors.postalcode[0]
                            : null
                        }
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
                          handleError(e);
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
                          error={hasError('percentage')}
                          helperText={
                            hasError('percentage')
                              ? formState.errors.percentage[0]
                              : null
                          }
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
                            handleError(e);
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
                        error={hasError('CompanyName')}
                        helperText={
                          hasError('CompanyName')
                            ? formState.errors.CompanyName[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Company Name"
                        name="CompanyName"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.name = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
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
                        error={hasError('taxId')}
                        helperText={
                          hasError('taxId') ? formState.errors.taxId[0] : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Tax ID"
                        name="taxId"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.taxid = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
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
                        error={hasError('CompanyLineAddress')}
                        helperText={
                          hasError('CompanyLineAddress')
                            ? formState.errors.CompanyLineAddress[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Line Address"
                        name="CompanyLineAddress"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.lineAddress = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={companyDetails.lineAddress}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('CompanyCity')}
                        helperText={
                          hasError('CompanyCity')
                            ? formState.errors.CompanyCity[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="City"
                        name="CompanyCity"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.city = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={companyDetails.city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('CompanyState')}
                        helperText={
                          hasError('CompanyState')
                            ? formState.errors.CompanyState[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="State"
                        name="CompanyState"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.state = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={companyDetails.state}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('CompanyPostalcode')}
                        helperText={
                          hasError('CompanyPostalcode')
                            ? formState.errors.CompanyPostalcode[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Postal Code"
                        name="CompanyPostalcode"
                        type="number"
                        onChange={e => {
                          setcompanyDetails(prev => {
                            prev.postalCode = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
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
                        error={hasError('bankname')}
                        helperText={
                          hasError('bankname')
                            ? formState.errors.bankname[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Bank Name"
                        name="bankname"
                        onChange={e => {
                          setbankDetails(prev => {
                            prev.name = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={bankDetails.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('accountNumber')}
                        helperText={
                          hasError('accountNumber')
                            ? formState.errors.accountNumber[0]
                            : null
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Account Number"
                        name="accountNumber"
                        onChange={e => {
                          setbankDetails(prev => {
                            prev.accountNumber = e.target.value;
                            return { ...prev };
                          });
                          handleError(e);
                        }}
                        value={bankDetails.accountNumber}
                        variant="outlined"
                        type="number"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={hasError('routingNumber')}
                        helperText={
                          hasError('routingNumber')
                            ? formState.errors.routingNumber[0]
                            : null
                        }
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
                          handleError(e);
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
                    disabled={
                      //if their is an error then form finish button will be disabled
                      activeStep === steps.length - 1 && !formState.isValid
                    }>
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
