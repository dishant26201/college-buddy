import { RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import FlexBetween from "./FlexBetween";

const ShortlistedUniversity = ({ color, shortlist }) => {

  return (
    <FlexBetween padding="1rem" borderRadius="0.75rem" sx={{ border: `1px solid ${color}` }}>
        <Typography fontWeight="500" variant="h5" sx={{ fontFamily: "Rubik, sans-serif", fontSize: "16px" }}>
          {shortlist.NAME}
        </Typography>
        <IconButton
        >
            <RemoveCircleOutline sx={{ color: "#f44336" }} />
        </IconButton>
    </FlexBetween>
  );
};

export default ShortlistedUniversity;