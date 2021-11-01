import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  Link
} from '@material-ui/core';
import { signup, fetchSubscriptions } from 'actions'; ////signup from session actions
import SubscriptionModal from '../Subscription/SubscriptionModal'; //// Pan modal to show on signup

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128,
      minimum: 6 //// minimum requirement 6 characters
    }
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
  }
};

const useStyles = makeStyles(theme => ({
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  policy: {
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  }
}));

const RegisterForm = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const history = useHistory(); ///obj to access useRouter

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [subscription, setSubscription] = useState([]); ///state for subcription data from
  const [modalOpen, setModalOpen] = useState(false); //state to open plan modal
  const [selected, setSelected] = useState(); ///state for selected subscription

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  // use effect to fetch all subscription and save into state
  useEffect(async () => {
    const temp = await fetchSubscriptions(setSubscription);
    setSubscription(temp);
    setSelected(temp[0]._id);
  }, []);

  const handleChange = event => {
    event.persist();

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

  const handleSubmit = async event => {
    event.preventDefault();
    // opening modal on submit
    setModalOpen(true);
    // data to send to backend
  };

  // dunction to create agency account
  const onCreateAccount = async () => {
    // data to submit to db
    const data = {
      fullName: `${formState.values.firstName} ${formState.values.lastName}`,
      email: formState.values.email,
      type: 'AGENCY',
      password: formState.values.password,
      policy: formState.values.policy,
      subscription: selected
    };
    // passing data and history to signup action
    signup(data, history);
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <form
      {...rest}
      className={clsx(classes.root, className)}
      onSubmit={handleSubmit}>
      <div className={classes.fields}>
        <TextField
          error={hasError('firstName')}
          helperText={
            hasError('firstName') ? formState.errors.firstName[0] : null
          }
          label="First name"
          name="firstName"
          onChange={handleChange}
          value={formState.values.firstName || ''}
          variant="outlined"
        />
        <TextField
          error={hasError('lastName')}
          helperText={
            hasError('lastName') ? formState.errors.lastName[0] : null
          }
          label="Last name"
          name="lastName"
          onChange={handleChange}
          value={formState.values.lastName || ''}
          variant="outlined"
        />
        <TextField
          error={hasError('email')}
          fullWidth
          helperText={hasError('email') ? formState.errors.email[0] : null}
          label="Email address"
          name="email"
          onChange={handleChange}
          value={formState.values.email || ''}
          variant="outlined"
        />
        <TextField
          error={hasError('password')}
          fullWidth
          helperText={
            hasError('password') ? formState.errors.password[0] : null
          }
          label="Password"
          name="password"
          onChange={handleChange}
          type="password"
          value={formState.values.password || ''}
          variant="outlined"
        />
        <div>
          <div className={classes.policy}>
            <Checkbox
              checked={formState.values.policy || false}
              className={classes.policyCheckbox}
              color="primary"
              name="policy"
              onChange={handleChange}
            />
            <Typography color="textSecondary" variant="body1">
              I have read the{' '}
              <Link
                color="secondary"
                component={RouterLink}
                to="#"
                underline="always"
                variant="h6">
                Terms and Conditions
              </Link>
            </Typography>
          </div>
          {hasError('policy') && (
            <FormHelperText error>{formState.errors.policy[0]}</FormHelperText>
          )}
        </div>
      </div>
      <Button
        className={classes.submitButton}
        color="secondary"
        disabled={!formState.isValid}
        size="large"
        type="submit"
        variant="contained">
        Select Plan
      </Button>
      {/* modal on select plan button */}
      <SubscriptionModal
        open={modalOpen}
        setOpen={setModalOpen}
        selected={selected}
        setSelected={setSelected}
        subscription={subscription}
        onCreateAccount={onCreateAccount}
      />
    </form>
  );
};

RegisterForm.propTypes = {
  className: PropTypes.string
};

export default RegisterForm;
