import * as React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = props => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'grid',
        placeItems: 'center'
      }}>
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: theme =>
            theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
          animationDuration: '550ms',
          position: 'absolute',
          left: 0
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
};

export default Loader;
