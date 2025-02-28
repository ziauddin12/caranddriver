import React, { useEffect } from "react";
import "./StartFinding.css";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const StartFinding = () => {
  const userType = localStorage.getItem('userType'); 
  const userId = localStorage.getItem('userId'); 
  const navigate = useNavigate(); // Get navigate function
  if (userType === 'carowner') {
    navigate(`/carowner-profile/${userId}`);
  } else if(userType === 'driver'){
    navigate(`/driver-profile/${userId}`);
  }
  const { t, i18n } = useTranslation(); // Hook for translation
  
    // Load language preference on component mount
    useEffect(() => {
      const savedLang = Cookies.get("language");
      if (savedLang) {
        i18n.changeLanguage(savedLang);
      }
    }, [i18n]);
  return (
    <>
      <Navbar />
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="mb-[-18px]">
            <span className="highlight">{t("startFinding")}....</span>
          </h1>
          <h1>
            <span className="highlight"> ....{t("stopSearching")} </span>
          </h1>
          <hr className="divider1" />
          <p className="description">
            <span> 
            <strong className="capitalD">D</strong> 
             {t("driveWillDescription").slice(1)}
           </span>
        </p>
          <div className="cta-buttons">
          <Link to="/Car-Owner"> <button className="cta-primary">{t("findWheelman")}</button></Link>
            <hr className="divider2" />
            <Link to="/driver"> <button className="cta-secondary">{t("findCar")}</button></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartFinding;
