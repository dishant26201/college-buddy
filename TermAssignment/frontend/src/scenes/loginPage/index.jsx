import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import Form from './Form';

const LoginPage = () => {

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor="#0b2149"
        padding="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="#ffffff" fontFamily="Rubik, sans-serif">
          CollegeBuddy
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        padding="2rem"
        margin="2rem auto"
        border="1px solid #bdbdbd"
        borderRadius="1.5rem"
        backgroundColor="#ffffff"
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem", fontFamily: "Rubik, sans-serif", fontSize: "18px" }}>
          Find your Dream College with CollegeBuddy!
        </Typography>
        <Form />
      </Box>
    </Box>
  )
};

export default LoginPage;