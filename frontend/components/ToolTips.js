import { Button, Tooltip } from '@mui/material';
import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

export default function ToolTips(props) {
    const { name } = props;
    return (
        <Tooltip title={name} placement="right">
            <InfoIcon />
        </Tooltip>
    );
}
