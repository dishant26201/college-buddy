import { useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserSession } from "service/AuthService";

const registerUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/register"; // store this and x-api-key in environment variable later
const loginUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/login"; // store this and x-api-key in environment variable later
const addSubscriberURL = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/addsubscriber"; // store this and x-api-key in environment variable later

const registerSchema = yup.object().shape({
  FIRST_NAME: yup.string().required("required"),
  LAST_NAME: yup.string().required("required"),
  PREFERRED_LOCATIONS: yup.string().required("required"),
  PREFERRED_PROGRAM: yup.string().required("required"),
  GRADE_PERCENTAGE: yup.number().required("required"),
  EMAIL: yup.string().email("invalid email").required("required"),
  PASSWORD: yup.string().required("required")
});

const loginSchema = yup.object().shape({
  EMAIL: yup.string().email("invalid email").required("required"),
  PASSWORD: yup.string().required("required"),
});

const initialValuesRegister = {
  FIRST_NAME: "",
  LAST_NAME: "",
  EMAIL: "",
  PASSWORD: "",
  PREFERRED_LOCATIONS: "",
  PREFERRED_PROGRAM: "",
  GRADE_PERCENTAGE: 0,
  
};

const initialValuesLogin = {
  EMAIL: "",
  PASSWORD: "",
};

const Form = (props) => {
  const [pageType, setPageType] = useState("login");
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    console.log(values);

    // store in environment variable later
    const requestConfig = {
      headers: { 
        'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
      }
    }

    // maybe this syntax will error when I try with aws cause "then" might not be es6. Try async/await in that case
    axios.post(registerUrl, values, requestConfig).then((response) => {
      axios.post(addSubscriberURL, values, requestConfig).then((response) => {
        console.log(response);
      }).catch(error => {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log(error.response.data.message);
        }
        else {
          console.log("server down"); // do proper error handling later
        }
      })
      setUserSession(response.data.user, response.data.token);
      navigate("/home");
    }).catch(error => {
      if (error.response.status === 401 || error.response.status === 403) {
        console.log(error.response.data.message);
      }
      else {
        console.log("server down"); // do proper error handling later
      }
    })
  };

  const login = async (values, onSubmitProps) => {
    console.log(values);

    // store in environment variable later
    const requestConfig = {
      headers: { 
        'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
      }
    }

    // maybe this syntax will error when I try with aws cause "then" might not be es6. Try async/await in that case
    axios.post(loginUrl, values, requestConfig).then((response) => {
      setUserSession(response.data.user, response.data.token);
      navigate("/home");
    }).catch(error => {
      if (error.response.status === 401 || error.response.status === 403) {
        console.log(error.response.data.message);
      }
      else {
        console.log("server down"); // do proper error handling later
      }
    })
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
        <form onSubmit={handleSubmit}>
            {isRegister && (
              <Typography fontWeight="500" variant="h5" color="#9e9e9e" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "12px", marginBottom: "1.5rem", marginTop: "-0.75rem" }}>
                The information you provide here will be used by our AI powered recommendation system to recommend schools, and also rate your chances of being accepted at a particular school.
              </Typography>
            )}
            <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{"& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
            >
                {isRegister && (
                    <>
                        <TextField
                            label="First Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.FIRST_NAME}
                            name="FIRST_NAME"
                            error={ Boolean(touched.FIRST_NAME) && Boolean(errors.FIRST_NAME) }
                            helperText={touched.FIRST_NAME && errors.FIRST_NAME}
                            sx={{ gridColumn: "span 2" }}
                        />

                        <TextField
                            label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.LAST_NAME}
                            name="LAST_NAME"
                            error={Boolean(touched.LAST_NAME) && Boolean(errors.LAST_NAME)}
                            helperText={touched.LAST_NAME && errors.LAST_NAME}
                            sx={{ gridColumn: "span 2" }}
                        />

                        <TextField
                            label="Preferred Locations"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.PREFERRED_LOCATIONS}
                            name="PREFERRED_LOCATIONS"
                            error={Boolean(touched.PREFERRED_LOCATIONS) && Boolean(errors.PREFERRED_LOCATIONS)}
                            helperText={touched.PREFERRED_LOCATIONS && errors.PREFERRED_LOCATIONS}
                            sx={{ gridColumn: "span 4" }}
                        />

                        <FormControl 
                          sx={{ gridColumn: "span 4" }}
                          error={Boolean(touched.PREFERRED_PROGRAM) && Boolean(errors.PREFERRED_PROGRAM)}
                          helperText={touched.PREFERRED_PROGRAM && errors.PREFERRED_PROGRAM}
                        >
                          <InputLabel id="demo-simple-select-label">Preferred Program</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            label="Preferred Program"
                            onChange={handleChange}
                            value={values.PREFERRED_PROGRAM}
                            name="PREFERRED_PROGRAM"
                          >
                            <MenuItem value={"Science"}>Science</MenuItem>
                            <MenuItem value={"Engineering"}>Engineering</MenuItem>
                            <MenuItem value={"Computer Science"}>Computer Science</MenuItem>
                            <MenuItem value={"Medicine"}>Medicine</MenuItem>
                            <MenuItem value={"Law"}>Law</MenuItem>
                            <MenuItem value={"Commerce"}>Commerce</MenuItem>
                            <MenuItem value={"Arts"}>Arts</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                            label="High-School Grade"
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.GRADE_PERCENTAGE}
                            name="GRADE_PERCENTAGE"
                            error={Boolean(touched.GRADE_PERCENTAGE) && Boolean(errors.GRADE_PERCENTAGE)}
                            helperText={touched.GRADE_PERCENTAGE && errors.GRADE_PERCENTAGE}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </>
                )}

                <TextField
                    label="Email"
                    type="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.EMAIL}
                    name="EMAIL"
                    error={Boolean(touched.EMAIL) && Boolean(errors.EMAIL)}
                    helperText={touched.EMAIL && errors.EMAIL}
                    sx={{ gridColumn: "span 4" }}
                />
                <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.PASSWORD}
                    name="PASSWORD"
                    error={Boolean(touched.PASSWORD) && Boolean(errors.PASSWORD)}
                    helperText={touched.PASSWORD && errors.PASSWORD}
                    sx={{ gridColumn: "span 4" }}
                /> 
            </Box>

            <Box>
                <Button
                    fullWidth
                    type="submit"
                    sx={{
                        margin: "2rem 0",
                        padding: "1rem",
                        backgroundColor: "#1a75ff",
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontFamily: "Rubik, sans-serif",
                        fontSize: "14px",
                        "&:hover": { cursor: "pointer", backgroundColor: "#1a75ff" },
                    }}
                >
                    {isLogin ? "Login" : "Register"}
                </Button>
                <Typography
                    onClick={() => {
                        setPageType(isLogin ? "register" : "login");
                        resetForm();
                    }}
                    sx={{
                        color: "#1a75ff",
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                >
                {isLogin
                    ? "Don't have an account? Register here."
                    : "Already have an account? Login here."}
                </Typography>
            </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;