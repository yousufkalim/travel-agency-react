import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Typography
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { useHistory } from 'react-router'; //////useHistory for routing
import { message } from 'antd'; ////antd toast message
import { deleteBooking } from 'actions';

const useStyles = makeStyles(theme => ({
  root: {},
  mainActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  notice: {
    marginTop: theme.spacing(1)
  },
  deleteButton: {
    marginTop: theme.spacing(1),
    color: theme.palette.white,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const OtherActions = props => {
  const { className, totalCost, id, ...rest } = props;
  const history = useHistory(); ////useHistory object

  const classes = useStyles();

  /////onDelete function to delete booking
  const onDelete = () => {
    deleteBooking(id).then(res => {
      message.success(res.data.message);
      history.push('/reservation/bookinglist');
    });
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Other actions" />
      <Divider />
      <CardContent>
        <div
          className={classes.mainActions}
          style={{ display: 'flex', flexDirection: 'row', fontWeight: 600 }}>
          <CheckCircleOutlineIcon className={classes.buttonIcon} />
          Total Cost of the booking: ${totalCost}
        </div>
        <Typography className={classes.notice} variant="body2">
          Remove this booking data if customer requested that, if not please be
          aware that what has been deleted can never brough back
        </Typography>
        {/* delete button */}
        <Button className={classes.deleteButton} onClick={onDelete}>
          <DeleteIcon className={classes.buttonIcon} />
          Delete Booking
        </Button>
      </CardContent>
    </Card>
  );
};

OtherActions.propTypes = {
  className: PropTypes.string
};

export default OtherActions;
