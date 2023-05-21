import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    // must at the bottom even the page is empty
    //   <Box sx={{ height: "100vh" }}></Box>
    <Box
      sx={{
        bottom: 0,
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        Copyright &copy; {new Date().getFullYear()} shereif.com
      </Typography>
    </Box>
  );
};

export default Footer;
