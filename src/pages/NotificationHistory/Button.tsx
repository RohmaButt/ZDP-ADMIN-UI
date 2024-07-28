import MuiButton from "@mui/material/Button";
import CircularProgress from "./CircularProgress";
import React from "react";

export interface ButtonProps {}
const defaultVariant = "contained" as any;

function Button(props: any) {
  return (
    <MuiButton
      variant={props.variant || defaultVariant}
      size={props.size || "small"}
      onClick={props.onClick}
      {...props}
    >
      {props.loading ? (
        <CircularProgress
          color={props.variant === defaultVariant ? "secondary" : "primary"}
          size={16}
        />
      ) : (
        props.children
      )}
    </MuiButton>
  );
}

export default Button;
