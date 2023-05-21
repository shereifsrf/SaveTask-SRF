import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/login/login";
import RequireAuth from "./components/login/RequireAuth";
import Header from "./components/header";
import Guest from "./components/login/guest";
import Register from "./components/login/register";
import { CssBaseline } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <CssBaseline />
    <BrowserRouter>
      <Header />
      <Routes>
        {/* if logged in, go to App. Else login */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<App />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="guest" element={<Guest />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </>
);
