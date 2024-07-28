import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { handleLogout } from "../SignOutButton";
import SignInButton from "../SignInButton";
import { IconButton, InputBase } from "@mui/material";
import { useMutation } from "@apollo/client";
import { SignInAzureAD } from "../../graphql/auth/mutation";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { getRoutePath } from "../../utils/common";
import { loginRequest } from "../../config/authConfig";
import { addUser, selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppIds, userLocalStorageKey } from "../../utils/constants";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import "moment-timezone";
import moment from "moment";
import { client } from "../../providers";
import { useNavigate } from "react-router-dom";
import {
  GET_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS_COUNT,
} from "../../graphql/notifications/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  UPDATE_NOTIFICATION_ACTION,
  RESET_UNREAD_NOTIFICATIONS_COUNT,
} from "../../graphql/notifications/mutations";
import React from "react";
import { ProfileBarComponent } from "@zdp-pim/zdp-ui-kit";
import io from "socket.io-client";
const drawerWidth = 240;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const MyAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppBar(props: AppBarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElApp, setAnchorElApp] = useState<null | HTMLElement>(null);
  const [anchorElNotification, setAnchorElNotification] =
    useState<null | HTMLElement>(null);
  let navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [unReadNotifications, setUnReadNotifications] = useState(0);
  const [signInLoading, setsignInLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [clickedButtonIds, setClickedButtonIds] = useState<any[]>([]);
  const [clickedButtonActions, setClickedButtonActions] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [PaginatedDataFromDB, setPaginatedDataFromDB] = useState<any[]>([]);
  const [appendedData, setAppendedData] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const URL = process.env.REACT_APP_BACKEND_URL || "";
  const [appsMainURL, setAppsMainURL] = useState(
    process.env.REACT_APP_BACKEND_URL?.toString()
  );
  const [
    signInAzureAD,
    {
      data: userSignInData,
      loading: userSignInLoading,
      error: userSignInError,
    },
  ] = useMutation(SignInAzureAD, {
    client: client,
    notifyOnNetworkStatusChange: true,
  });

  const {
    loading: loadingNotficationsData,
    error: errorNotficationsData,
    data: notficationsData,
    refetch: refetchNotifications,
  } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: "network-only",
    variables: {
      pagination: { limit: 5, offset: page },
    },
  });

  const {
    loading: loadingUnreadNotificationsCount,
    error: errorUnreadNotificationsCount,
    refetch: RefetchUnReadNotificationsCount,
    data: unReadNotificationsCount,
  } = useQuery(GET_UNREAD_NOTIFICATIONS_COUNT);

  useEffect(() => {
    setUnReadNotifications(
      unReadNotificationsCount?.getUnreadNotificationCount
        ?.unreadNotificationCount
    );
  }, [unReadNotificationsCount]);

  useEffect(() => {
    setsignInLoading(true);
    const userData = localStorage.getItem(userLocalStorageKey);
    if (isAuthenticated && !userData) {
      const accountInfo = instance.getAllAccounts()[0];
      const getAccessToken = async () => {
        try {
          const result = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accountInfo,
          });
          signInAzureAD({
            variables: {
              input: {
                token: `Bearer ${result.accessToken}`,
                appId: AppIds.PIM,
              },
            },
          });
        } catch (err) {
          if (err instanceof InteractionRequiredAuthError) {
            return instance.acquireTokenRedirect(loginRequest);
          }
        }
      };
      getAccessToken();
    } else if (!user && userData) {
      dispatch(addUser(JSON.parse(userData)));
      setsignInLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userSignInData) {
      userSignInData.signInAzureAD.time_zone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;
      userSignInData.signInAzureAD.time_zone_offset = moment()
        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .format("Z");
      dispatch(addUser(userSignInData?.signInAzureAD));
      localStorage.setItem(
        userLocalStorageKey,
        JSON.stringify(userSignInData?.signInAzureAD)
      );
      setsignInLoading(false);
    } else if (userSignInError) {
      setsignInLoading(false);
    }
    setsignInLoading(false);
  }, [userSignInData, userSignInError]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    if (value === "Logout") {
      handleLogout(instance);
    } else if (value === "Profile") {
      navigate(getRoutePath("/userprofile"));
    }
    setAnchorElUser(null);
  };

  const handleOpenAppMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElApp(event.currentTarget);
  };

  const handleCloseAppMenu = () => {
    setAnchorElApp(null);
  };

  const handleOpenNotification = (event: React.MouseEvent<HTMLElement>) => {
    console.log("handleOpenNotification");
    resetUnreadNotificationCount({})
      .then((result) => {
        setPage(0);
        // refetchNotifications();
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const [
    updateNotificationAction,
    {
      data: updateNotificationData,
      loading: updateNotificationLoading,
      error: updateNotificationError,
    },
  ] = useMutation(UPDATE_NOTIFICATION_ACTION);

  useEffect(() => {
    const latestId = clickedButtonIds[clickedButtonIds.length - 1];
    const latestAction = clickedButtonActions[clickedButtonActions.length - 1];
    if (clickedButtonIds.length > 0) {
      updateNotificationAction({
        variables: {
          param: {
            id: latestId,
          },
          input: {
            action: latestAction,
          },
        },
      })
        .then((result) => {
          refetchNotifications();
          console.log("Updated Notification: ", result);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    }
  }, [clickedButtonIds]);

  const [
    resetUnreadNotificationCount,
    {
      data: resetNotificationsCountData,
      loading: resetNotificationsCountLoading,
      error: resetNotificationsCountError,
    },
  ] = useMutation(RESET_UNREAD_NOTIFICATIONS_COUNT);

  const handleActionable = (id1: any, action1: any) => {
    setClickedButtonIds((prevId: any) => [...prevId, id1]);
    setClickedButtonActions((prevId: any) => [...prevId, action1]);
  };

  useEffect(() => {
    const socket = io(URL, {
      extraHeaders: {
        Authorization: JSON.parse(
          localStorage?.getItem("type") || "{}"
        )?.auth_token.toString(),
      },
    });
    socket.emit("createConnection", "join");
    socket.on("getUnreadNotificationCount", (data) => {
      console.log("socket data", data);
      setMessage(data?.unreadNotificationCount);
    });

    socket.on("message", (data) => {
      //   -> Exception
      if (JSON.parse(data)?.event == "error") {
        console.log(
          "socket exception message",
          JSON.parse(data)?.data?.message
        );
      }
    });
    return () => {
      socket.emit("closeConnection", "leave");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("useEffect page", page);
    setPaginatedDataFromDB(notficationsData?.getAllNotification?.data || []);
    if (page === 0)
      setAppendedData(notficationsData?.getAllNotification?.data || []);
  }, [notficationsData?.getAllNotification?.data, page]);

  const fetchMoreData = () => {
    console.log("fetchMoreData", page, PaginatedDataFromDB);
    try {
      setPage(page + 1);
      const newData = PaginatedDataFromDB;
      console.log("aa4", page, newData);
      if (appendedData === undefined || appendedData?.length >= 100) {
        setHasMore(false);
        return;
      }
      if (
        PaginatedDataFromDB === undefined ||
        PaginatedDataFromDB?.length === 0
      ) {
        setHasMore(false);
        return;
      } else {
        if (page !== 0) {
          setAppendedData((prevFirstArray: any) => [
            ...prevFirstArray,
            ...newData,
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <MyAppBar
      sx={{ backgroundColor: "#F7F8FA", boxShadow: "none" }}
      position="fixed"
      open={open}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            alignItems: "center",
          }}
        >
          {user ? (
            <Box
              sx={{
                width: "100%",
                height: "35px",
                marginLeft: !open ? "50px" : "15px",
                marginRight: "5px",
              }}
            >
              <IconButton
                type="button"
                sx={{
                  marginLeft: "8px",
                  fontSize: "medium",
                  marginTop: "0px",
                  color: "#D1D3D4",
                }}
                aria-label="search"
              >
                <SearchOutlined
                  style={{ height: "20px", width: "15px", color: "gray" }}
                />
              </IconButton>
              <InputBase
                sx={{ ml: 0.1, flex: 10, outline: "1px", width: "70%" }}
                placeholder="Search"
                inputProps={{
                  "aria-label": "Search",
                }}
              />
            </Box>
          ) : null}

          {isAuthenticated && user ? (
            <Box sx={{ marginRight: "70px" }}>
              <ProfileBarComponent
                handleOpenAppMenu={handleOpenAppMenu}
                handleCloseAppMenu={handleCloseAppMenu}
                anchorElApp={anchorElApp}
                user={user}
                data={appendedData}
                handleOpenUserMenu={handleOpenUserMenu}
                handleCloseUserMenu={handleCloseUserMenu}
                anchorElUser={anchorElUser}
                handleCloseNotification={handleCloseNotification}
                handleOpenNotification={handleOpenNotification}
                anchorElNotification={anchorElNotification}
                unReadNotificationsCount={Number(message) || 0}
                handleActionable={handleActionable}
                appsMainURL={appsMainURL}
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}
                pageNumber={page}
              />
            </Box>
          ) : (
            <SignInButton loading={userSignInLoading} />
          )}
        </Box>
      </Toolbar>
    </MyAppBar>
  );
}
