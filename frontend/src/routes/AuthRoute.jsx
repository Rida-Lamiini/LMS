import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";


import React from 'react'

export function AuthRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}>
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="*" element={<NoPage />} /> */}
          <LoginPage/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
