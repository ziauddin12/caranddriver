import React, { useState, useEffect  } from "react";
import logo from "./Images/logo.png";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes ,  faGlobe, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import "../Components/Navbar.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from '../Components/services/api';
import IMAGE_API from '../Components/services/ImgBase';
import Cookies from "js-cookie";

function DriverNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const authToken = localStorage.getItem('authToken');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(!!authToken);
   const [isLogin, setIsLogin] = useState(false);
  const { t, i18n } = useTranslation(); // Hook for translation
   // State to store selected language and flag
   const [selectedLanguage, setSelectedLanguage] = useState({
    // name: "English",
    flag: "https://flagcdn.com/w40/us.png",
  });


  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = useNavigate();

  /*const handleRegisterClick = () => {
    navigate("/register");   
  };*/

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (lang, flag) => {
    setSelectedLanguage({  flag });
    console.log(flag);
    let codeLang = 'en';
    if(lang === "English"){
      codeLang = "en";
    } else if(lang === "Spanish"){
      codeLang = "es";
    } else if(lang === "French"){
      codeLang = "fr";
    } else if(lang === "German"){
      codeLang = "de";
    } else if(lang === "Arabic"){
      codeLang = "eg";
    }

    // Save language preference in cookies
     Cookies.set("language", codeLang, { expires: 365 }); // Store for 1 year
     // Save language preference in cookies
     Cookies.set("flag", flag, { expires: 365 }); // Store for 1 year

     i18n.changeLanguage(codeLang);
 
    setIsLanguageDropdownOpen(false); // Close dropdown after selection
  };

  // Load language preference on component mount
useEffect(() => {
  setIsLogin(!!userId); // Convert to boolean (true if userId exists)
  const savedLang = Cookies.get("language");
  if (savedLang) {
    i18n.changeLanguage(savedLang);
  }

  const savedFlag = Cookies.get("flag");
  if (savedFlag) {
    setSelectedLanguage({ flag: savedFlag }); // Fix: Use correct object structure
  }
}, []);

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem('authToken'); // Get the token from localStorage
  
      if (!authToken) {
        console.error('No token found in localStorage');
        return;
      }
  
      await API.post(
        '/users/logout',
        {}, // No body needed for logout
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
          },
        }
      );
  
      // Clear local storage and navigate to home
      //localStorage.removeItem('authToken');
     // localStorage.removeItem('userType');
     localStorage.clear(); // Clears all items from localStorage 
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const userId = localStorage.getItem("userId");
  
  const userImageSub = localStorage.getItem('userImage'); 

  // Construct the full URL
const userImage = `${IMAGE_API}${userImageSub}`;
  

  
  return (
    <>
      <header className="navBg">
        <nav className="navbar">
          {/* Left side - Logo */}
          <div className="navbar-logo">
            <img src={logo} alt="Custom" />
          </div>

          {/* Hamburger Icon */}
          <div className="hamburger-icon" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </div>

          {/* Center - Navigation Links */}
          <ul
            className={`navbar-links ${isMobileMenuOpen ? "mobile-menu" : ""}`}
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t("home")}
              </NavLink>
            </li>
           
            <li>
              <NavLink
                to="/*"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              > 
                {t("messages")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t("notifications")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/terms"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t("wallet")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/driver-profile"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
               {t("driver")}
              </NavLink>
            </li>

            {isLogin && (
   <li className="lg:hidden">
    <NavLink
                to={`/profile/${userId}`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t("profile")}
                </NavLink>  </li>
)}

            {isLogin && (
  <li className="cursor-pointer text-white" onClick={handleLogout}>
  {i18n.t("logout")}
</li>
)}


          
           
              {/* Language Dropdown */}
    <div className="navbar-language">
            <div
              className="language-dropdown-trigger"
              onClick={toggleLanguageDropdown}
            >
              {/* Display selected flag */}
              <img
                src={selectedLanguage.flag}
                alt={`${selectedLanguage.name} Flag`}
                style={{ width: "30px", height: "18px" }}
              />
              <span style={{ marginLeft: "10px" }}>
                {selectedLanguage.name}
              </span>
            </div>
            {isLanguageDropdownOpen && (
              <ul className="language-dropdown">
                <li onClick={() => handleLanguageChange("English", "https://flagcdn.com/w40/us.png")}>
                  <img
                    src="https://flagcdn.com/w40/us.png"
                    alt="USA Flag"
                    style={{ width: "30px", height: "18px" }}
                  />{" "}
                  
                </li>
                <li onClick={() => handleLanguageChange("Spanish", "https://flagcdn.com/w40/es.png")}>
                  <img
                    src="https://flagcdn.com/w40/es.png"
                    alt="Spain Flag"
                    style={{ width: "30px", height: "18px" }}
                  />{" "}
                  
                </li>
                <li onClick={() => handleLanguageChange("French", "https://flagcdn.com/w40/fr.png")}>
                  <img
                    src="https://flagcdn.com/w40/fr.png"
                    alt="France Flag"
                    style={{ width: "30px", height: "18px" }}
                  />{" "}
                  
                </li>
                <li onClick={() => handleLanguageChange("German", "https://flagcdn.com/w40/de.png")}>
                  <img
                    src="https://flagcdn.com/w40/de.png"
                    alt="Germany Flag"
                    style={{ width: "30px", height: "18px" }}
                  />{" "}
                  
                </li>
                <li onClick={() => handleLanguageChange("Arabic", "https://flagcdn.com/w40/eg.png")}>
                  <img
                    src="https://flagcdn.com/w40/eg.png"
                    alt="Arabic Flag"
                    style={{ width: "30px", height: "18px" }}
                  />{" "}
                  
                </li>
              </ul>
            )}
          </div>
         
          </ul>
  

          {/* Right side - Signup */}
          <div className="navbar-signup">
           
            {/* <FontAwesomeIcon icon={faUser} className="user-icon" /> */}
            {/* Right side - Profile Dropdown */}
          <div className="navbar-profile">
            <div className="profile-dropdown-trigger flex" onClick={toggleProfileDropdown}>
            <img
                src={userImage}// Replace with the actual user profile image URL
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown">
                <li onClick={() => navigate(`/driver-profile/${userId}`)}> {t("profile")} </li>
                <li onClick={() => navigate("/driver-profile")}>{t("editProfile")}</li>
                <li onClick={handleLogout}>{t("logout")}</li>
              </ul>
            )}
          </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default DriverNavbar;
