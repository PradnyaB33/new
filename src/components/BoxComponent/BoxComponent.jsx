import { Box } from '@mui/material';
import React from 'react';
import { useDrawer } from '../app-layout/components/Drawer';

const BoxComponent = ({ children, sx }) => {
    const { open } = useDrawer();

    return (
        <Box
            sx={{
                ...sx,
                bgcolor: "#F9FAFC",
                p: open ? "3% 5%" : "3% 10%",
                height: '90vh',
                overflowY: 'auto',

            }}
        >
            {children}
        </Box>
    );
}

export default BoxComponent;
