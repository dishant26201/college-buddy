import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { getToken } from "service/AuthService";

const PrivateRoutePostLogin = () => {
    const auth = getToken();

    return auth ? <Navigate to="/home" /> : <Outlet />
}

export default PrivateRoutePostLogin;