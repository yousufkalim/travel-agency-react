import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from 'validate.js';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField, colors, Typography } from '@material-ui/core';

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
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const GeneralSettings = props => {
  const classes = useStyles();
  const history = useHistory(); ///obj to access useRouter

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

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

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <form
      className={classes.root}
      style={{ backgroundColor: 'white', padding: 20 }}
      onSubmit={() => console.log('submittt')}>
      <div className={classes.fields}>
        <div style={{ width: '100%' }}>
          <Typography variant="h4">Profile</Typography>
        </div>

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
        <select
          name="country"
          style={{
            width: '100%',
            padding: 10,
            marginBottom: 15,
            border: '1px solid 	rgb(128,128,128,0.4)'
          }}
          value={formState.values.country || ''}
          onChange={handleChange}>
          <option value="" disabled selected>
            Select Your Country
          </option>
          <option value="BR">Brazil</option>
          <option value="PT">portagal</option>
        </select>
      </div>
      <div style={{ marginTop: 20, width: '100%', textAlign: 'right' }}>
        <Button
          className={classes.saveButton}
          color="secondary"
          disabled={!formState.isValid || !formState.values.country}
          size="large"
          type="submit"
          variant="contained">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string
};

export default GeneralSettings;
