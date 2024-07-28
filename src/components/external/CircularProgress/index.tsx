import * as React from "react";
import MuiCircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";

export default function CircularProgress(props: CircularProgressProps) {
  return <MuiCircularProgress {...props} />;
}
