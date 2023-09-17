import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Card, Paper, Typography } from '@mui/material';
import { memo } from 'react';
const Alerts = (props) => {
  const { value } = props;
  console.log('value', value);
  return (
    <Paper className="info-container" elevation={6} >
      <InfoOutlinedIcon className='infoButton' />
      <Box className="low">
        <Typography variant="h5">
          <b>Info</b>
        </Typography>
        <Typography variant="body1">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

export default memo(Alerts);
