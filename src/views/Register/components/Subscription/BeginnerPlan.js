import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const BeginnerPlan = ({ selected, setSelected, subscription }) => {
  return (
    <Card
      style={{
        border: selected === subscription._id && '1px solid blue',
        width: 400
      }}
      onClick={() => setSelected(subscription._id)}>
      <CardContent>
        <Typography variant="h2" component="div">
          <b>{subscription.type} Plan</b>
        </Typography>
        <Typography variant="h4" component="div">
          $<b>{subscription.price}</b>
        </Typography>
        <br />
        <br />
        <Typography variant="h6" component="div">
          In this plan you will get the basic features like trip management,
          manage customer, manage trip reservation, view basic report.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BeginnerPlan;
