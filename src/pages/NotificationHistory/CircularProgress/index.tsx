import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
type IProps = {
  size?: number;
  [key: string]: any; // Allow any other additional props
};

export default function CircularProgressComponent({
  size,
  ...otherProps
}: IProps) {
  return <CircularProgress size={size} {...otherProps} />;
}

CircularProgressComponent.defaultProps = {
  size: 24,
};
