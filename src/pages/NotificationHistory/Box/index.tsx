import React, { ReactNode } from "react";
import Box from "@mui/material/Box";

type IProps = {
  children: ReactNode;
  [key: string]: any; // Allow any other additional props
};

export default function BoxComponent({ children, ...otherProps }: IProps) {
  return <Box {...otherProps}>{children}</Box>;
}

BoxComponent.defaultProps = {
  children: <></>,
};
