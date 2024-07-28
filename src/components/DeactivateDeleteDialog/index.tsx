import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FC, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";
import { DeleteUser, UpdateUser } from "../../graphql/users/mutations";
import WarningImg from "./../../assets/icon/warning_icon.png";
import React from "react";

type DeactivateDeleteDialog = {
  handleClose: () => void;
  isOpen: boolean;
  onDone: () => void;
  title: string;
  userId: undefined;
  alertType: string;
  refetchAllUserData: () => void;
};

const DeactivateDeleteDialog: FC<DeactivateDeleteDialog> = ({
  isOpen,
  handleClose,
  title,
  onDone,
  userId,
  alertType,
  refetchAllUserData,
}: DeactivateDeleteDialog) => {
  const handleCloseHandler = () => {
    handleClose();
  };

  const handleDone = () => {
    if (alertType === "deactivate") {
      deactivateMemberMutation({
        variables: {
          param: { id: userId },
          input: {
            isActive: false,
          },
        },
      });
    } else if (alertType === "delete") {
      deleteMemberMutation({
        variables: {
          param: { id: userId },
        },
      });
    }
  };

  const [
    deactivateMemberMutation,
    {
      data: deactivateMemberRes,
      loading: deactivateMemberLoading,
      error: deactivateMemberError,
    },
  ] = useMutation(UpdateUser);

  const [
    deleteMemberMutation,
    {
      data: deleteMemberRes,
      loading: deleteMemberLoading,
      error: deleteMemberError,
    },
  ] = useMutation(DeleteUser);

  useEffect(() => {
    if (!deactivateMemberError && deactivateMemberRes) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Record updated successfully."}
          />
        ),
        ...notificationOptions,
      });
      handleCloseHandler();
      refetchAllUserData();
    }
  }, [deactivateMemberRes]);

  useEffect(() => {
    if (!deleteMemberError && deleteMemberRes) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Record deleted successfully."}
          />
        ),
        ...notificationOptions,
      });
      handleCloseHandler();
      refetchAllUserData();
    }
  }, [deleteMemberRes]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleCloseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ p: "24px", display: "flex", gap: "16px", alignItems: "center" }}
        >
          <Box sx={{ width: "40px", height: "40px" }}>
            <img src={WarningImg} alt="Warning Icon" />
          </Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: 1.33,
              letterSpacing: "0em",
              textAlign: "left",
              color: "#121C2B",
            }}
          >
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ p: "24px", pl: "80px", display: "flex", alignItems: "center" }}
        >
          <DialogContentText id="alert-dialog-description">
            <Box>
              <Typography
                sx={{
                  fontFamily: "Open Sans",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: 1.5,
                  letterSpacing: "0em",
                  textAlign: "left",
                  color: "#323E4D",
                }}
              >
                {alertType == "deactivate"
                  ? "Are you sure that you want to deactivate this member? They will no longer maintain their access to ZDP unless reactivated."
                  : "Are you sure that you want to delete this member? This is destructive action that can not be done."}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            marginBottom: "10px",
            borderTop: "1px solid #E2E5E9",
            p: "10px 24px",
          }}
        >
          {deactivateMemberLoading || deleteMemberLoading ? (
            <CircularProgress size={"20px"} sx={{ marginRight: "15px" }} />
          ) : (
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Button
                sx={{
                  color: "#005596",
                  width: "97px",
                  height: "44px",
                  border: "1px solid #ECEEF0",
                  borderRadius: "34px",
                }}
                variant="text"
                size="small"
                onClick={handleCloseHandler}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    letterSpacing: "0em",
                    textAlign: "left",
                    color: "#323E4D",
                  }}
                >
                  Cancel
                </Typography>
              </Button>
              <Button
                sx={{
                  color: "#005596",
                  width: "97px",
                  height: "44px",
                  border: "1px solid #C60000",
                  borderRadius: "34px",
                  backgroundColor: "#C60000",
                  "&:hover": {
                    backgroundColor: "#C60000",
                  },
                }}
                variant="contained"
                size="small"
                onClick={(ev) => handleDone()}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    letterSpacing: "0em",
                    textAlign: "left",
                    color: "#FFFFFF",
                  }}
                >
                  {alertType == "deactivate" ? "Deactivate" : "Delete"}
                </Typography>
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeactivateDeleteDialog;
