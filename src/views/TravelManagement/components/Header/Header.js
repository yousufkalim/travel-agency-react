import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const { className, compName, ...rest } = props; /// compName holding name of prev component

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            Travels
          </Typography>
          {/* checking previous component and showing title */}
          {compName === 'archived' ? (
            <Typography component="h1" variant="h3">
              Trip Archive
            </Typography>
          ) : (
            <Typography component="h1" variant="h3">
              Trip List
            </Typography>
          )}
        </Grid>
        {/* Showing create button if prev component is not archived */}
        {compName !== 'archived' && (
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/travels/trip/create">
              Create Trip
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
