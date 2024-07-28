import React from "react";
import MuiButton from "@mui/material/Button";

export interface ButtonProps {};

function Button(props: any) {
  return (
    <MuiButton
      variant="contained"
      size="small"
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </MuiButton>
  );
}

export default Button;
