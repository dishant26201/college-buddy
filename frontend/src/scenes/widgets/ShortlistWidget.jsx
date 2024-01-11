import { Box, Button, Divider, Typography, IconButton } from "@mui/material";
import { RemoveCircleOutline } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import getUser, { resetUserSession } from "service/AuthService";
import { useState, useEffect } from "react";
import axios from "axios";
import markChances, {colorChances} from "service/Util";

const shortlistUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/getuser";
const deleteShortlistUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/deleteshortlist";
const emailShortlistUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/emailshortlist";


const ShortlistWidget = (props) => {

    const user = getUser();

    const userEmail = user.EMAIL; 

    const highSchoolGrade = user.GRADE_PERCENTAGE;

    const [shortlist, setShortlist] = useState([]);

    useEffect(() => {
        const requestConfig = {
            headers: { 
                'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
            }
        }
        const getData = async () => {
            const response = await axios.post(shortlistUrl, {"email": userEmail}, requestConfig);
            setShortlist(response.data.SHORTLISTED_UNIVERSITIES);
        }
        getData();
    }, [])

    console.log(shortlist);

    const removeShortlist = async (uniIndex, email, ITEM_ID) => {
        const requestConfig = {
            headers: { 
                'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
            }
        }
        const updatedShortlist = shortlist.filter(shortlist => shortlist.ITEM_ID !== ITEM_ID);
        const response = await axios.post(deleteShortlistUrl, {"email": email, "uniIndex": uniIndex}, requestConfig);
        console.log(response);
        setShortlist(updatedShortlist);
    }

    const emailShortlist = async () => {

        // store in environment variable later
        const requestConfig = {
          headers: { 
            'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
          }
        }

        const newArr = [];
        shortlist.forEach((uni) => {
            newArr.push(` ${uni.NAME}`);
        });
    
        const response = await axios.post(emailShortlistUrl, {"email": userEmail, "shortlist": newArr.toString()}, requestConfig);
        console.log(response);
      };

    return (
        <WidgetWrapper margin="1rem 0" backgroundColor="#ffffff" border="1px solid #bdbdbd" sx={{ padding: "1.5rem 1.5rem 1.5rem 1.5rem" }}>
            <Box display="flex" flexDirection="column" gap="2rem">
                <>
                    {shortlist.map((shortlisted) => (
                        <FlexBetween key={shortlisted.ITEM_ID} padding="1rem" borderRadius="0.75rem" sx={{ border: `1px solid ${colorChances(highSchoolGrade, shortlisted.ACCEPTANCE_RATE, shortlisted.AVG_GRADE_REQUIREMENT)}` }}>
                            <Typography fontWeight="500" variant="h5" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "16px" }}>
                            {shortlisted.NAME}
                            </Typography>
                            <IconButton onClick={() => removeShortlist(shortlist.indexOf(shortlisted), userEmail, shortlisted.ITEM_ID)}>
                                <RemoveCircleOutline sx={{ color: "#f44336" }} />
                            </IconButton>
                        </FlexBetween>
                        )
                    )}
                </>
            </Box>
            <Button
                type="submit"
                onClick={emailShortlist}
                sx={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "#0b2149",
                marginTop: "2rem",
                color: "#ffffff",
                fontWeight: "bold",
                fontFamily: "Rubik, sans-serif",
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": { cursor: "pointer", backgroundColor: "#0b2149" },
                }}
            >
                Email Shortlist
            </Button>
        </WidgetWrapper>
    )
};

export default ShortlistWidget;