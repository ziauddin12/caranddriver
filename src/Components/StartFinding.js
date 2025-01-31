import React from "react";
import "./StartFinding.css";
import Navbar from "./Navbar";

const StartFinding = () => {
  return (
    <>
      <Navbar />
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="mb-[-18px]">
            <span className="lightweight">Stop</span>{" "}
            <span className="highlight">Searching....</span>
          </h1>
          <h1>
            <span className="lightweight"> ....Start </span>
            <span className="highlight">Finding.</span>
          </h1>
          <hr className="divider1" />
          <p className="description">
            <span> <strong className="capitalD"> D</strong>riveWill connects skilled drivers</span>{" "}
            <span>with car owners, offering a fast</span>
            <span>convenient, and secure</span>{" "}
            <span>experience for everyone.</span>
            <span>No more waiting.</span> <span> No more hassle.</span>
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">Find a Wheelman</button>
            <hr className="divider2" />
            <button className="cta-secondary">Find a Car</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartFinding;
