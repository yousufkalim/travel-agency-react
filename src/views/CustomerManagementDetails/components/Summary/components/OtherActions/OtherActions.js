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
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { deleteCustomer } from 'actions'; ////delete customer action
import { useHistory } from 'react-router'; //////useHistory for routing
import { message } from 'antd'; ////antd toast message
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
  const { className, customerId, ...rest } = props;
  const history = useHistory(); ////useHistory object

  const classes = useStyles();

  /////onDelete function to delete single customer
  const onDelete = () => {
    deleteCustomer(customerId).then(res => {
      message.success(res.data.msg);
      history.push('/management/customers');
    });
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Other actions" />
      <Divider />
      <CardContent>
        <div className={classes.mainActions}>
          <Button>
            <NotInterestedIcon className={classes.buttonIcon} />
            Close Customer Account
          </Button>
          <Button>
            <GetAppIcon className={classes.buttonIcon} />
            Export client data
          </Button>
        </div>
        <Typography className={classes.notice} variant="body2">
          Remove this this customer’s data if he requested that, if not please
          be aware that what has been deleted can never brough back
        </Typography>
        {/* delete button */}
        <Button className={classes.deleteButton} onClick={onDelete}>
          <DeleteIcon className={classes.buttonIcon} />
          Delete Customer Account
        </Button>
      </CardContent>
    </Card>
  );
};

OtherActions.propTypes = {
  className: PropTypes.string
};

export default OtherActions;
