import React, { useState } from "react";
import Register2 from "./Register2";
import Register from "./Register";

function Signup() {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && <Register nextStep={() => setStep(2)} />}
      {step === 2 && <Register2 prevStep={() => setStep(1)} />}
    </>
  );
}

export default Signup;
