import { Box, DialogActions } from "@mui/material";
import Button from "./Button";
import React from "react";

interface FooterProps {
  onClose: () => void;
  onRun: () => void;
  onSave: () => void;
  isCreateFilter?: boolean;
}

export function Footer(props: FooterProps) {
  const { onClose, onRun, onSave, isCreateFilter } = props;

  return (
    <Box sx={{ justifyContent: "flex-end" }}>
      <DialogActions sx={{ padding: "15px", borderTop: "1px solid #E2E5E9" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          style={{
            textTransform: "none",
            fontWeight: "bold",
            height: "fit-content",
            marginRight: "5px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          loading={isCreateFilter}
          onClick={onSave}
          style={{
            textTransform: "none",
            fontWeight: "bold",
            height: "fit-content",
            marginRight: "5px",
          }}
        >
          Save
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={onRun}
          style={{
            textTransform: "none",
            fontWeight: "bold",
            height: "fit-content",
            marginRight: "5px",
          }}
        >
          Run
        </Button>
      </DialogActions>
    </Box>
  );
}
