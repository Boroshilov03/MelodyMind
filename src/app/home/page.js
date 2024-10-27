import React from "react";
import Spline from "@splinetool/react-spline/next";

function page() {
  // It's a good practice to capitalize component names
  return (
    <div>
      <h1>Welcome</h1>
      <Spline scene="https://prod.spline.design/ZaVCUY8TrM6BCcfW/scene.splinecode" />
    </div>
  );
}

export default page; // Export the component
