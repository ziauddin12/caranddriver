import React from "react";
import "./DriverBenfits.css";
import Navbar from "./Navbar";
import Imageright from "../assets/navigator-smartphone-car-night-closeup.jpg";
import { Link } from "react-router-dom";

function DriverBenfits() {
  return (
    <>
      <Navbar />
      <div className="HomeDriver">
        <div className="homeContainerDriver flex  lg:flex-row items-center justify-between gap-8">
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2">
            <div className="headingDriver redlineDriver">
              <span className="CarFontDriver">Driver</span> <span>Benefits</span>
            </div>
            <div className="homeDriverHeadingDriver">
            <h5 className="flex items-center gap-2">
                <span className='inline-block  -ml-[25px] tickIcon font-extrabold w-5 h-[30px] text-red-500 flex-shrink-0'>&#10003; </span>
                <span>Find high-paying driving jobs in seconds.</span>
              </h5>              
              <p>
                <span>Drive other people's cars long term and </span>
                <span>make money, even if you don't own one.</span>
              </p>
            </div>
            <div className="homeDriverHeadingDriver">
            <h5 className="flex items-center gap-2">
                <span className='inline-block -ml-[25px] tickIcon font-extrabold w-5 h-[30px] text-red-500 flex-shrink-0'>&#10003; </span>
                <span>Make Money, Even When Your Car is Down</span>
              </h5>              <p>
                <span>You can use drivewill to drive other people's </span>
                <span>cars for a few days. You can even use these </span>
                <span>earnings to pay off repair costs.</span>
              </p>
            </div>
            <div className="homeDriverHeadingDriver">
            <h5 className="flex items-center gap-2">
                <span className='inline-block -ml-[25px] tickIcon font-extrabold w-5 h-[30px] text-red-500 flex-shrink-0'>&#10003; </span>
                <span>Build a Stable Career in Driving</span>
              </h5>                         <p>
                <span>Looking for a stable career behind the wheel? </span>
                <span>Drivewill connects you with a variety </span>
                <span>of driving opportunities, from private driving </span>
                <span>and delivery services to micro-mobility. Find </span>
                <span>stable work in your city and start earning </span>
                <span>today.</span>
              </p>
            </div>
            <div className="buttonContainerDriver">
              <Link to="/register"> <button className="btnDriver">Get your ride now</button></Link>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="w-full lg:w-1/2 imghide">
            <img
              src={Imageright}
              alt="Driver Benefits"
              className="w-full h-auto max-h-[400px] rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DriverBenfits;