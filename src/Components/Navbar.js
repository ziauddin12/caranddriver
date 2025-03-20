import React, { useState, useEffect } from "react";
import logo from "./Images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes ,  faGlobe, faCaretDown} from "@fortawesome/free-solid-svg-icons";
import "../Components/Navbar.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IMAGE_API from '../Components/services/ImgBase';
import Cookies from "js-cookie";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
   // State to store selected language and flag
   const [selectedLanguage, setSelectedLanguage] = useState({
    // name: "English",
    flag: "https://flagcdn.com/w40/us.png",
  });

  const [isDriverOrCarowner, setIDriverOrCarowner] = useState('driver-profile');

  const { t, i18n } = useTranslation(); // Hook for translation

  // Check if user is logged in
  const authToken = localStorage.getItem('authToken');
  const [isLogin, setIsLogin] = useState(!!authToken);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);


  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");   
  };

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
      const savedLang = Cookies.get("language");
      if (savedLang) {
        i18n.changeLanguage(savedLang);
      }
    
      const savedFlag = Cookies.get("flag");
      if (savedFlag) {
        setSelectedLanguage({ flag: savedFlag }); // Fix: Use correct object structure
      }
    }, []);

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      setIsLogin(!!userId); // Convert to boolean (true if userId exists)

      const userType = localStorage.getItem('userType'); 
      if (userType === 'carowner') { 
        setIDriverOrCarowner('carowner-profile');
      }
    }, []);

    const toggleProfileDropdown = () => {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };
  
    const handleLogout = () => {
      //localStorage.removeItem("userId");
      //localStorage.removeItem("userImage");
      localStorage.clear(); // Clears all items from localStorage 
      setIsLogin(false); // Update state
      navigate("/login");
    };

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
                {t("services")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t("contact")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/terms"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t("terms")}
              </NavLink>
            </li>
            {!isLogin && (
  <li>
    <NavLink
      to="/login"
      className={({ isActive }) => (isActive ? "active-link" : "")}
    >
      {t("login")}
    </NavLink>
  </li>
)}

{isLogin && (
  <li className="cursor-pointer text-white" onClick={handleLogout}>
  {i18n.t("logout")}
</li>
)}

 {!isLogin && (
            <li className="showSignUp">
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t("signup")}
              </NavLink>
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
           
          {!isLogin ? (
        <button className="signup-button bg-orange-500 hover:bg-orange-500" onClick={handleRegisterClick}>
           {t("signup")}
        </button>
      ) : (
        <div className="navbar-profile">
          <div className="profile-dropdown-trigger flex" onClick={toggleProfileDropdown}>
            <img
              src={userImage}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
          </div>
          {isProfileDropdownOpen && authToken && (
            <ul className="profile-dropdown">
              <li onClick={() => navigate(`/${isDriverOrCarowner}/${localStorage.getItem("userId")}`)}>
                {i18n.t("profile")}
              </li>
              <li onClick={() => navigate(`/${isDriverOrCarowner}`)}>{i18n.t("editProfile")}</li>
              <li onClick={handleLogout}>{i18n.t("logout")}</li>
            </ul>
          )}
        </div>
      )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
