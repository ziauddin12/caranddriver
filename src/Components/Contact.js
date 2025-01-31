import React from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import Navbar from "./Navbar";

function Contact() {
  return (
    <>
      <Navbar />
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ mb: 3, color: "#666" }}
        >
          We'd love to hear from you. Fill out the form below to get in touch!
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#fff",
              },
            }}
          />
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            type="email"
            required
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#fff",
              },
            }}
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            required
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#fff",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              fontWeight: "bold",
              py: 1.5,
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Contact;
