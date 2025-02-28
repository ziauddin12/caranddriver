import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import Navbar from "./Navbar";

function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <Container
        maxWidth="md"
        sx={{
          mt: { xs: 0, sm: 4 },
          mb: { xs: 0, sm: 4 },
          p: 3,
          backgroundColor: "#f9f9f9",
          borderRadius: { xs: 0, sm: 2 },
          boxShadow: 3,
          overflow: "auto",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Privacy Policy
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph sx={{ color: "#666", mb: 2 }}>
          Welcome to our platform! By accessing or using our services, you agree
          to abide by the following terms and conditions. Please read them
          carefully.
        </Typography>

        <Box sx={{ maxHeight: { xs: "100%", sm: "40vh" }, overflowY: "auto", pr: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "#444" }}>
            1. General Terms
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: "#555" }}>
            All users must comply with the rules and regulations of our
            platform. Violation of any terms may result in account suspension or
            termination. This includes providing accurate information during
            registration and refraining from any unauthorized activities.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "#444" }}>
            2. Driver and Rider Responsibilities
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: "#555" }}>
            Drivers must ensure that their vehicles meet safety standards and
            comply with local traffic laws. Riders are required to behave
            respectfully and responsibly during rides. Any disputes must be
            reported immediately to our support team.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "#444" }}>
            3. Payment Policies
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: "#555" }}>
            Payment must be completed via the app. Any unauthorized payment
            methods are strictly prohibited. Refund requests will be processed
            based on our refund policy, which is outlined in the Help section.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "#444" }}>
            4. Privacy Policy
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: "#555" }}>
            We prioritize your privacy. All user data is stored securely and
            handled in accordance with our privacy policy. Sharing sensitive
            information is strictly prohibited.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "#444" }}>
            5. Limitation of Liability
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: "#555" }}>
            Our platform is not responsible for any direct or indirect damages
            caused by the use of our services. Users are responsible for their
            actions and compliance with all applicable laws.
          </Typography>

          <Typography variant="body2" paragraph sx={{ mt: 3, color: "#555" }}>
            For detailed information, please contact our support team. By
            continuing to use the platform, you acknowledge that you have read
            and agreed to all terms.
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default PrivacyPolicy;
