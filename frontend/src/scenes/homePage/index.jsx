import { Box, Button, Typography, useMediaQuery, IconButton, InputBase } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import ShortlistWidget from 'scenes/widgets/ShortlistWidget';
import UniversitiesWidget from 'scenes/widgets/UniversitiesWidget';
import { useState } from "react";
import { Search, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import getUser, { resetUserSession } from "service/AuthService";
import { Universities } from "../../store/universities";
import axios from 'axios';

const recommendationsUrl = "https://m5j1b1drp9.execute-api.us-east-1.amazonaws.com/prod/getrecommendations";

const HomePage = () => {

  const user = getUser();
  const name = user !== "undefined" && user ? user.FIRST_NAME : "User"; 
  const navigate = useNavigate();

  const [query, setQuery] = useState();
  const [universityList, setUniversityList] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [mainArea, setMainArea] = useState("recommend");

  const getRecommendations = async (userEmail) => {
    const requestConfig = {
      headers: { 
        'x-api-key': "zasMQiZspKYqsDlqdiTU8yAokU33VX44fyMgaWZ2"
      }
    }
    const response = await axios.post(recommendationsUrl, {"EMAIL": userEmail}, requestConfig);
    var itemList = response.data.itemList;
    var tempList = [];
    itemList.forEach((item) => {
      Universities.forEach((university) => {
        if (university.ITEM_ID === item.itemId) {
          tempList.push(university);
        }
      });
    });
    setUniversityList(tempList);
    setMainArea("recommend");
  }

  const logoutHandler = () => {
    resetUserSession();
    navigate("/");
    console.log("User logged out")
  }

  function getSearchResults() {
    if (query === "" || query === null || query === undefined) {
      setMainArea("emptyQuery");
      console.log("Enter search query");
    }
    else {
      const searchList = Universities.filter(university => university.NAME.toLowerCase().includes(query) || university.LOCATION.toLowerCase().includes(query) || university.FLAGSHIP_PROGRAMS.toLowerCase().includes(query));
      if (searchList.length === 0) {
        setMainArea("invalidQuery");
      }
      else {
        setMainArea("search");
        setUniversityList(searchList);
        console.log("Search: ", searchList);
      }
    }
  };


  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const fullName = "Hi Dishant!"


  return (
    <Box>
      <FlexBetween padding="1rem 6%" backgroundColor="#0b2149">
        <FlexBetween gap="3rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            fontFamily="Rubik, sans-serif"
            color="#ffffff"
            onClick={() => navigate("/home")}
            sx={{
              "&:hover": {
                cursor: "pointer"
              },
            }}
          >
            CollegeBuddy
          </Typography>
          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor="#ffffff"
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase placeholder="Search for a University, Province, or Program" onChange={e => setQuery(e.target.value)} sx={{ fontSize: "14px", width: "20rem" }}/>
              <IconButton onClick={getSearchResults}>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {isNonMobileScreens ? (
          <FlexBetween gap="1rem">
            <Typography
              fontWeight="bold"
              fontSize="1rem, 2rem, 2.25rem"
              color="#ffffff"
              onClick={() => navigate("/profile")}
              sx={{
                "&:hover": {
                  cursor: "pointer"
                },
              }}
            >
              Hi {name}!
            </Typography>
            <AccountCircle onClick={logoutHandler} sx={{ fontSize: "4rem", color: "#ffffff", "&:hover": { cursor: "pointer" }}} />
          </FlexBetween>
        ) : (
          <IconButton>
            <AccountCircle onClick={logoutHandler} sx={{ fontSize: "4rem", color: "#ffffff", "&:hover": { cursor: "pointer" }}} />
          </IconButton>
        )}
      </FlexBetween>
      <Box
        width="100%"
        padding="2rem 6%"
        marginTop="2rem"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "30%" : undefined}>
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            fontFamily="Rubik, sans-serif"
            color="#1a75ff"
          >
            Your Shortlist
          </Typography>
          <ShortlistWidget />
        </Box>
        <Box flexBasis={isNonMobileScreens ? "60%" : undefined} marginTop={isNonMobileScreens ? undefined : "2rem"}>
          <FlexBetween sx={{ alignItems: "end", marginBottom: "-0.75rem"}}>
            {mainArea === 'recommend' && 
              <Typography fontWeight="500" variant="h5" color="#000000" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "20px" }}>
                Recommended For You:
              </Typography>
            }
            {(mainArea === 'search' ||  mainArea === 'invalidQuery' || mainArea === 'emptyQuery') && 
              <Typography fontWeight="500" variant="h5" color="#000000" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "20px" }}>
                Search Results:
              </Typography>
            }
            <Button
                type="submit"
                onClick={() => getRecommendations(user.EMAIL)}
                sx={{
                    padding: "0.5rem",
                    width: "20%",
                    borderRadius: "0.5rem",
                    backgroundColor: "#ffcc00",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontFamily: "Rubik, sans-serif",
                    fontSize: "1rem",
                    textTransform: "none",
                    "&:hover": { cursor: "pointer", backgroundColor: "#ffcc00" },
                }}
            >
                Recommend
            </Button>
          </FlexBetween>
          {mainArea === 'recommend' && 
            <>
              <UniversitiesWidget universities={universityList} />
            </>
          }
          {mainArea === 'emptyQuery' && 
            <>
              <Typography fontWeight="500" variant="h5" color="#9e9e9e" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "18px", marginBottom: "1.5rem", marginTop: "4.75rem", textAlign: "center"}}>
                Please enter a keyword to get search results.
              </Typography>
            </>
          }
          {mainArea === 'invalidQuery' && 
            <>
              <Typography fontWeight="500" variant="h5" color="#9e9e9e" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "14px", marginBottom: "1.5rem", marginTop: "0.75rem", width: "50%"}}>
                Oops! No result for your query
              </Typography>
            </>
          }
          {mainArea === 'search' && 
            <>
              <UniversitiesWidget universities={universityList} />
            </>
          }
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;