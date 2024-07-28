import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { txtFieldStyles } from "./style";
import TypographyComponent from "../Typography";
import { TextFieldTypes } from "../../../utils/constants";
import searchbarIcon from "../../../assets/icon/searchbar-icon.svg";
import { NoEncryption } from "@mui/icons-material";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Paper, Typography } from "@mui/material";
import React from "react";
type IProps = {
  label?: string;
  variant?: any;
  value?: string;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: any;
  types?: TextFieldTypes;
  height?: string;
  [key: string]: any; // Allow any other additional props
};

export default function TextFieldComponent({
  label,
  variant,
  value,
  onChange,
  types,
  height,
  sx,
  ...otherProps
}: IProps) {
  const getStyles = () => {
    if (types === TextFieldTypes.Disable) {
      return {
        ...txtFieldStyles.disableTxt,
        "& .MuiInputBase-root": {
          height: height,
          borderRadius: "8px",
          color: "#323E4D",
        },
      };
    } else if (types === TextFieldTypes.Search) {
      return {
        ...txtFieldStyles.searchTxt,
        "& .search-input": {
          width: "100%",
        },
      };
    } else {
      return {
        ...txtFieldStyles.enableTxt,
        "& .MuiInputBase-root": {
          height: height,
          borderRadius: "8px",
        },
      };
    }
  };

  return (
    <>
      {types === TextFieldTypes.Search ? (
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Paper component="form" sx={getStyles()}>
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>

            <InputBase
              className="search-input"
              sx={{ ml: 1, flex: 1 }}
              value={value}
              onChange={onChange}
              placeholder={label}
              inputProps={{ "aria-label": "search" }}
              {...otherProps}
            />
          </Paper>
        </Box>
      ) : (
        <TextField
          id="outlined-basic"
          value={value}
          onChange={onChange}
          label={
            <Typography variant="body1" sx={{ color: "#121C2B" }}>
              {label}
            </Typography>
          }
          variant={variant ? variant : "outlined"}
          sx={{ ...getStyles(), ...sx }}
          inputProps={{ disableUnderline: true }}
          {...otherProps}
        />
      )}
    </>
  );
}

TextFieldComponent.defaultProps = {
  height: "48px",
  types: TextFieldTypes.Enable,
};
