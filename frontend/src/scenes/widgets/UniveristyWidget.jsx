import { Box, Button, Divider, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import getUser, { resetUserSession } from "service/AuthService";
import axios from "axios";
import markChances, {colorChances} from "service/Util";

const addShortlistUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/addshortlist";

const UniveristyWidget = ({ university }) => {

    const user = getUser();
    const userEmail = user.EMAIL; 

    const highSchoolGrade = user.GRADE_PERCENTAGE;

    const requestConfig = {
        headers: { 
            'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
        }
    }
    const addToShortlist = async (university, email) => {
        const response = await axios.post(addShortlistUrl, {"university": university, "email": email}, requestConfig);
        console.log(response);
    }

    return (
        <WidgetWrapper margin="2rem 0" backgroundColor="#ffffff" border="1px solid #bdbdbd">
            <FlexBetween>
                <Typography fontWeight="500" variant="h5" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "18px" }}>
                    {university.NAME}
                </Typography>
                <Typography fontWeight="500" variant="h5" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "18px", color: colorChances(highSchoolGrade, university.ACCEPTANCE_RATE, university.AVG_GRADE_REQUIREMENT) }}>
                    {markChances(highSchoolGrade, university.ACCEPTANCE_RATE, university.AVG_GRADE_REQUIREMENT)}
                </Typography>
            </FlexBetween>
            <Divider sx={{ marginTop: "0.75rem", marginBottom: "1rem" }} />
            <FlexBetween  sx={{ alignItems: "start" }}>
                <Box flex="1 1 0">
                    <Typography fontWeight="500" variant="h5" color="#9e9e9e" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px", marginBottom: "0.5rem" }}>
                        Location:
                    </Typography>
                    <Typography fontWeight="500" variant="h5" color="#000000" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px" }}>
                        {university.LOCATION}
                    </Typography>
                </Box>
                <Box flex="1 1 0">
                    <Typography fontWeight="500" variant="h5" color="#9e9e9e" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px", marginBottom: "0.5rem" }}>
                        Acceptance Rate:
                    </Typography>
                    <Typography fontWeight="500" variant="h5" color="#000000" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px" }}>
                        {university.ACCEPTANCE_RATE}
                    </Typography>
                </Box>
                <Box flex="1 1 0">
                    <Typography fontWeight="500" variant="h5" color="#9e9e9e" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px", marginBottom: "0.5rem" }}>
                        Entry Requirement:
                    </Typography>
                    <Typography fontWeight="500" variant="h5" color="#000000" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px" }}>
                        {university.AVG_GRADE_REQUIREMENT}
                    </Typography>
                </Box>
                <Box flex="1 1 0">
                    <Typography fontWeight="500" variant="h5" color="#9e9e9e" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px", marginBottom: "0.5rem" }}>
                        Flagship Programs:
                    </Typography>
                    <Typography fontWeight="500" variant="h5" color="#000000" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px" }}>
                        {university.FLAGSHIP_PROGRAMS}
                    </Typography>
                </Box>
            </FlexBetween>
            <Button
                type="submit"
                onClick={() => addToShortlist(university, userEmail)}
                sx={{
                    padding: "0.5rem",
                    width: "20%",
                    borderRadius: "0.5rem",
                    backgroundColor: "#1a75ff",
                    marginTop: "1rem",
                    marginBottom: "0.5rem",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontFamily: "Rubik, sans-serif",
                    fontSize: "1rem",
                    textTransform: "none",
                    "&:hover": { cursor: "pointer", backgroundColor: "#1a75ff" },
                }}
            >
                Shortlist
            </Button>
        </WidgetWrapper>
    );
};

export default UniveristyWidget;