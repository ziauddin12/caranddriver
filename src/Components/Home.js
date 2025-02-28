import React from "react";
import "./Home.css";
import Navbar from "./Navbar";
import Imageleft from "../assets/salesman-car-showroom.jpg";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <Navbar />
      <div className="Home">
        <div className="homeContainer flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side: Image */}
          <div className="w-full lg:w-1/2">
            <img
              src={Imageleft}
              alt="Car Owner Benefits"
              className="w-full rounded-lg object-cover shadow-lg"
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full lg:w-1/2">
            <div className="heading redline">
              <span className="CarFont">Car Owner</span> <span>Benefits</span>
            </div>
            <div className="homeDriverHeading">
              
              <h5 className="flex items-center gap-2">
                <span className='inline-block  -ml-[25px] tickIcon font-extrabold w-5 h-[30px] text-red-500 flex-shrink-0'>&#10003; </span>
                <span>Find Drivers in minutes with Drivewill</span>
              </h5> 
              <p>
                <span>If you're looking to invest in a car for ridesharing </span>
                <span>services but are concerned about finding </span>
                <span>reliable drivers, Drivewill can help. Easily find </span>
                <span>experienced drivers through our platform and </span>
                <span>grow your fleet effortlessly.</span>
              </p>
            </div>
            <div className="homeDriverHeading">
              
              <h5 className="flex items-center gap-2">
                <span className='inline-block  -ml-[25px] tickIcon font-extrabold w-5 h-[30px] text-red-500 flex-shrink-0'>&#10003; </span>
                <span>Absent driver? Try Drivewill</span>
              </h5> 
              <p>
                <span>If your driver is unavailable due to illness or</span>
                <span> other urgent matters, Drivewill's Hot Booking </span>
                <span>Service can swiftly find a short-term </span>
                <span>replacement </span>
              </p>
            </div>
            <div className="homeDriverHeading">
             
              <h5 className="flex items-center gap-2">
                <span className='inline-block  -ml-[25px] tickIcon font-extrabold w-5 h-[30px] text-red-500 flex-shrink-0'>&#10003; </span>
                <span>Rent Out Your Car with a Driver for Intercity Trips </span>
              </h5> 
              <p>
                <span>Rent out your car for intercity trips with a </span>
                <span>reliable driver. Drivewill connects you with </span>
                <span>
                  trusted drivers, hired specifically for your trip, to
                </span>
                <span> maximize your rental income.</span>
              </p>
            </div>
            <div className="buttonContainer">
            <Link to="/register"> <button>Find a Driver</button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;