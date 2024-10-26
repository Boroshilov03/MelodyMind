'use client'
import React, { useEffect } from "react";

const Callback = () => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");
    
    if (code) {
      // You can call a function here to fetch the access token
      // For example, calling fetchAccessToken(code) from a utility file
    }
  }, []);

  return <div>Loading...</div>; // Show loading while processing
};

export default Callback;
