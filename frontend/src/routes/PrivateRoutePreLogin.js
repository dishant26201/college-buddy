import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { getToken } from "service/AuthService";

const PrivateRoutePreLogin = () => {
    const auth = getToken();

    return auth ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoutePreLogin;