import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import registerImg from "./Images/man-with-glasses-shirt-that-says-happy-money_1322386-32315-scaled.jpg";
import { Box } from "@mui/material";
import "../Components/Register.css";
import { useTranslation } from "react-i18next";

import Cookies from "js-cookie";

function Register2({ nextStep }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    userType: "driver",
  });
  //const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { t, i18n } = useTranslation(); // Hook for translation

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number (10 digits)";
    }

    /*if (!isChecked) {
      newErrors.checkbox = "You must agree to the terms and conditions.";
    }*/

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Clear form
     // setFormData({ firstName: "", lastName: "", phone: "" });
     // setErrors({});
     // Save data to localStorage for Step 2
     localStorage.setItem("registerStep1", JSON.stringify(formData));
     nextStep(); // Move to the next step
    }
  };

  // Load language preference on component mount
        useEffect(() => {
          const savedLang = Cookies.get("language");
          if (savedLang) {
            i18n.changeLanguage(savedLang);
          }
        
           
        }, []);

  return (
    <>
      <div style={{ backgroundColor: "#F4F4F4", height: "auto" }}>
        <Navbar />
        <Box
          component="img"
          sx={{
            height: "auto",
            width: "100%",
          }}
          alt="The house from the offer."
          src={registerImg}
        />
        <div className="registerContainer">
          <form onSubmit={handleSubmit}>
            <div className="fields">
              <label htmlFor="firstName">{t("firstName")}:</label>
              <input
                className="label-gap4"
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <span style={{ color: "red" }}>{errors.firstName}</span>
              )}
            </div>

            <div className="fields">
              <label htmlFor="lastName">{t("lastName")}:</label>
              <input
                className="label-gap5"
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <span style={{ color: "red" }}>{errors.lastName}</span>
              )}
            </div>

            <div className="fields">
              <label htmlFor="phone">{t("phone")}:</label>
              <input
                className="label-gap6"
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <span style={{ color: "red" }}>{errors.phone}</span>
              )}
            </div>

            <div className="fields">
            <label htmlFor="userType">{t("iAmA")}:</label>
            <select
              className="label-gap6"
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="driver">{t("driver")}</option>
              <option value="carowner"> {t("carOwner")}</option>
            </select>
          </div>

            <button type="submit" className="registerBtn">
            {t("register")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register2;
