// init
import React from 'react';
import { Box, Card, CardContent, Typography } from '@material-ui/core';

// professional plan card
const ProfessionalPlan = ({ selected, setSelected, subscription }) => {
  return (
    <Card
      style={{
        border: selected === subscription?._id && '1px solid blue',
        width: 400
      }}
      onClick={() => setSelected(subscription?._id)}>
      <CardContent>
        <Typography variant="h2" component="div">
          <b>{subscription?.type} Plan</b>
        </Typography>
        <Typography variant="h4" component="div">
          $<b>{subscription?.price}</b>
        </Typography>
        <br />
        <br />
        <Typography variant="h6" component="div">
          In this plan you will enjoy all the features of a CRM, Tourism Website
          and Dashboard and with integrated payment integration API for Brazil
          and Portugal
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfessionalPlan;
