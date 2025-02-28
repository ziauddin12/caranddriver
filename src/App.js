import "./App.css";
import React, { useEffect } from "react";
import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import HomePage from "./Components/Home.js";
import DriverBenfits from "./Components/DriverBenfits.js";
import StartFinding from "./Components/StartFinding.js";
import { BrowserRouter, Route, Routes, useLocation  } from "react-router-dom";
import NotFound from "./Components/NotFound.js";
import Contact from "./Components/Contact.js";
import Terms from "./Components/Terms.js";
import DriverEditForm from "./Components/DriverEditForm.js";
import CarEditForm from "./Components/CarEditForm.js";
import PrivateRoute from "./Components/PrivateRoute.js";
import DriverProfile from "./Components/DriverProfile.js";
import CarProfile from "./Components/CarProfile.js";
import ForgotPassword from "./Components/ForgotPassword.js";
import ResetPassword from "./Components/ResetPassword.js";
import PrivacyPolicy from "./Components/PrivacyPolicy.js";
import VerifyOPTcode from "./Components/VerifyOPTcode.js";


import "./Components/i18n.js"; // Import i18n configuration

import '../src/index.css'
//import Register2 from "./Components/Register2.js";
function App() {

  const BodyClassUpdater = () => {
    const location = useLocation();
  
    useEffect(() => {
      // Extract the first part of the path before the slash
      const pageClass = location.pathname.split('/')[1] || "home";
      
      // Set class on body
      document.body.className = `page-${pageClass}`;
      
      return () => {
        // Cleanup: Remove class when component unmounts
        document.body.className = "";
      };
    }, [location]);
  
    return null;
  };

  return (
    <>
      {/* <CarEditForm/> */}
      {/* <Contact/> */}
      {/* <Navbar/> */}
      {/* <Register/> */}
      {/* <HomePage/> */}
      {/* <DriverBenfits/> */}
      {/* <StartFinding/> */}
      <BrowserRouter>
      <BodyClassUpdater />
        <Routes>
          <Route path="/" element={<StartFinding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/driver" element={<DriverBenfits />} />
          <Route path="/Car-Owner" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-opt" 
           element={<PrivateRoute element={<VerifyOPTcode />} />} />
          <Route
            path="/driver-profile"
            element={<PrivateRoute element={<DriverEditForm />} />}
          />
          <Route
            path="/driver-profile/:profileId"
            element={<PrivateRoute element={<DriverProfile />} />}
          />
          <Route
            path="/profile/:profileId"
            element={<PrivateRoute element={<DriverProfile />} />}
          />
          <Route
            path="/carowner-profile/:profileId"
            element={<PrivateRoute element={<CarProfile />} />}
          />

       <Route
            path="/carprofile/:profileId"
            element={<PrivateRoute element={<CarProfile />} />}
          />



          <Route
            path="/carowner-profile"
            element={<PrivateRoute element={<CarEditForm />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
