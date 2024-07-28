import React, { useEffect } from "react";
import {
  iNotification,
  NOTIFICATION_TYPE,
} from "react-notifications-component";
import { useTheme } from "@mui/material/styles";
import { Store } from "react-notifications-component";

type NotificationContentProps = {
  title?: string;
  message?: string;
  type?: NOTIFICATION_TYPE;
};

export const notificationOptions: iNotification = {
  insert: "bottom",
  container: "bottom-center",
  dismiss: {
    duration: 5000,
    onScreen: true,
  },
};

export default function NotificationContent({
  message,
  type,
}: NotificationContentProps) {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      Store.removeAllNotifications();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        color: "white",
        backgroundColor:
          type === "success"
            ? theme.palette.primary.light
            : theme.palette.error.light,
        padding: "10px",
        width: "100%",
      }}
    >
      {message && <div style={{ width: "100%" }}>{message}</div>}
    </div>
  );
}
