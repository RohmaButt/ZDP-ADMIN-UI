import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { AppBarProps as MuiNavBarProps } from "@mui/material/AppBar";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import newLogo from "../../assets/logos/logo.png";
import "../Layout/index.css";
import { IconButton } from "@mui/material";
import { selectUser } from "../../features/user/userSlice";
import { useAppSelector } from "../../app/hooks";
import toRightIcon from "../../assets/icon/to-right.png";
import toLeftIcon from "../../assets/icon/to-left.png";
import theme from "../../mui.theme";
import { AdminMenuItemsType, DrawerHeader, drawerWidth } from "../Layout";
import { getRoutePath } from "../../utils/common";

interface NavBarProps extends MuiNavBarProps {
  open?: boolean;
  adminMenuItems: AdminMenuItemsType[];
  getDefaultKey: string[];
  handleDrawer: () => void;
  hiddenMenuItem?: string[];
}

const NavBar = (props: NavBarProps) => {
  let navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const user = useAppSelector(selectUser);

  const DrawerFooter = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    padding: theme.spacing(1, 2),
    position: "absolute",
    bottom: 0,
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const openedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: "white",
    boxShadow: "7px 0px 24px -6px rgba(19, 38, 64, 0.08)",
    borderRight: "unset",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: "white",
    boxShadow: "7px 0px 24px -6px rgba(19, 38, 64, 0.08)",
    borderRight: "unset",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const onClick = (ev: any) => {
    navigate(ev.key);
  };

  return (
    <Drawer
      sx={{
        color: theme.palette.info.dark,
      }}
      variant="permanent"
      open={props.open}
    >
      <DrawerHeader>
        <IconButton
          onClick={() => {
            navigate(getRoutePath(""));
          }}
        >
          <img
            className="logo"
            src={newLogo}
            onClick={() => {
              getRoutePath("");
            }}
            alt={"Logo2"}
          />
        </IconButton>
      </DrawerHeader>

      {isAuthenticated && user ? (
        <List>
          {props.adminMenuItems.map((item, index) => {
            if (!props.hiddenMenuItem?.includes(item?.key)) {
              let isActiveItem = props.getDefaultKey.includes(item.key);
              return (
                <Tooltip title={item.label}>
                  <ListItem
                    key={item.label}
                    onClick={() => onClick(item)}
                    disablePadding
                    sx={{
                      display: "block",
                      marginTop: index !== 0 ? "10px" : "8px",
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: props.open ? "initial" : "center",
                        px: 2.5,
                        "&.Mui-selected": {
                          backgroundColor: "unset",
                        },
                        "&.MuiListItemButton-root:hover .MuiListItemIcon-root":
                          {
                            borderColor: "rgba(0, 0, 0, 0)",
                            filter: "brightness(12%) hue-rotate(216deg)",
                          },
                      }}
                      selected={isActiveItem ? true : false}
                    >
                      <ListItemIcon
                        sx={
                          isActiveItem
                            ? {
                                minWidth: 0,
                                mr: props.open ? 3 : "auto",
                                justifyContent: "center",
                                border: "10px solid rgba(0, 85, 150, 0.08)",
                                borderRadius: "10px",
                              }
                            : {
                                minWidth: 0,
                                mr: props.open ? 3 : "auto",
                                justifyContent: "center",
                                border: "10px solid white",
                              }
                        }
                      >
                        {isActiveItem ? item.iconActive : item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        sx={{ opacity: props.open ? 1 : 0, color: "black" }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            }
          })}
        </List>
      ) : null}
      <DrawerFooter>
        <IconButton onClick={props.handleDrawer}>
          {props.open ? (
            <img
              src={toLeftIcon}
              alt={"footer"}
              style={{ filter: "brightness(50%) hue-rotate(180deg)" }}
            />
          ) : (
            <img
              src={toRightIcon}
              alt={"footer"}
              style={{ filter: "brightness(50%) hue-rotate(180deg)" }}
            />
          )}
        </IconButton>
      </DrawerFooter>
    </Drawer>
  );
};

export default NavBar;
