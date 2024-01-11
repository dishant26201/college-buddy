import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import { useEffect, useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import PrivateRoutePostLogin from "routes/PrivateRoutePostLogin";
import PrivateRoutePreLogin from "routes/PrivateRoutePreLogin";
import getUser, { getToken, setUserSession, resetUserSession } from "service/AuthService";
import axios from "axios";

const verifyUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/verify"; // store this and x-api-key in environment variable later

function App() {

  const theme = useMemo(() => createTheme(themeSettings));

  useEffect(() => {
    const token = getToken();
    if (token === "undefined" || token === undefined || token === null || !token) {
      return;
    }

    // store in environment variable later
    const requestConfig = {
      headers: { 
        'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
      }
    }

    const requestBody = {
      user: getUser(),
      token: token
    }

    // maybe this syntax will error when I try with aws cause "then" might not be es6. Try async/await in that case
    axios.post(verifyUrl, requestBody, requestConfig).then((response) => {
      setUserSession(response.data.user, response.data.token);
    }).catch(error => {
      resetUserSession()
    })
  }, [])


  return (<div className="app">
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<PrivateRoutePostLogin /> }>
            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route path="/home" element={<PrivateRoutePreLogin /> }>
            <Route path="/home" element={<HomePage /> } />
          </Route>

        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </div>);
};

export default App;
