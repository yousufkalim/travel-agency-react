import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Button,
  Divider,
  TextField,
  colors
} from '@material-ui/core';
import { message } from 'antd';
import { changePassword } from 'actions';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const Security = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirm: ''
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  const handeleSubmit = e => {
    e.preventDefault();
    const valid = values.newPassword && values.newPassword === values.confirm;
    if (!valid) {
      message.error("New Password And Confirm Password Doesn't Match!");
    } else {
      let data = {
        currentPassword: values.oldPassword,
        newPassword: values.newPassword
      };
      changePassword(data)
        .then(res => {
          message.success(res.data.message);
        })
        .catch(error => {
          message.error(error?.response?.data?.error);
        });
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Change password" />
      <Divider />
      <CardContent>
        <form>
          <Grid container spacing={3}>
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="oldPassword"
                onChange={handleChange}
                type="password"
                value={values.oldPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                fullWidth
                label="New password"
                name="newPassword"
                onChange={handleChange}
                type="password"
                value={values.newPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                fullWidth
                label="Confirm New password"
                name="confirm"
                onChange={handleChange}
                type="password"
                value={values.confirm}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.saveButton}
          disabled={
            !values.oldPassword || !values.newPassword || !values.confirm
          }
          onClick={handeleSubmit}
          variant="contained">
          Save changes
        </Button>
      </CardActions>
    </Card>
  );
};

Security.propTypes = {
  className: PropTypes.string
};

export default Security;
