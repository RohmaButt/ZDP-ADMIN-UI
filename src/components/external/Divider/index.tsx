import React from "react";
import MuiDivider from "@mui/material/Divider";

type DividerPropsType = {
  style?: object;
};

export default function Divider({ style }: DividerPropsType) {
  return (
    <MuiDivider style={{ marginTop: "20px", marginBottom: "20px", ...style }} />
  );
}
