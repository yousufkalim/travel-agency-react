/* eslint-disable react/display-name */
import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid/v1';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  colors
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ReactQuill from 'react-quill'; ///// quill to show description
import 'react-quill/dist/quill.snow.css';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  field: {
    marginTop: theme.spacing(3)
  },
  cancelButton: {
    marginLeft: 'auto'
  },
  confirmButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const AddEditEvent = forwardRef((props, ref) => {
  const { event, className, onClose, ...rest } = props;

  const classes = useStyles();

  const [values] = useState(event);

  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            Trip
          </Typography>
          <TextField
            className={classes.field}
            fullWidth
            disabled={true}
            label="Title"
            name="title"
            value={values.title}
            variant="outlined"
          />
          <br />
          <br />
          <ReactQuill
            value={values.desc}
            readOnly={true}
            theme={'snow'}
            style={{ color: 'grey' }}
          />
          <TextField
            className={classes.field}
            defaultValue={moment(values.start).format('YYYY-MM-DD')}
            fullWidth
            disabled={true}
            label="Start date"
            name="start"
            variant="outlined"
          />
          <TextField
            className={classes.field}
            defaultValue={moment(values.end).format('YYYY-MM-DD')}
            disabled={true}
            fullWidth
            label="End date"
            name="end"
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.cancelButton}
            onClick={onClose}
            variant="contained">
            Close
          </Button>
        </CardActions>
      </form>
    </Card>
  );
});

AddEditEvent.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default AddEditEvent;
