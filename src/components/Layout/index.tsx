import React, { useEffect, useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import dashboard from "../../assets/icon/dashboard.png";
import dashboardActive from "../../assets/icon/dashboard_blue.png";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { handleLogout } from "../SignOutButton";
import SignInButton from "../SignInButton";
import { Login } from "../../pages";
import { useLocation, useNavigate } from "react-router-dom";
import company from "../../assets/icon/company.png";
import companyActive from "../../assets/icon/company_blue.png";
import accountGroupActive from "../../assets/icon/account_group_blue.png";
import ecommerceIcon from "../../assets/icon/e-commerce.svg";
import merchandisingIcon from "../../assets/icon/merchandising.png";
import pimAppIcon from "../../assets/icon/PIM-icon-only.png";
import settingsIcon from "../../assets/icon/setting.svg";
import accountGroup from "../../assets/icon/account_group.png";
import AppSelectorIcon from "../../assets/icon/app-selector-icon-only.png";
import "./index.css";
import {
  Autocomplete,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { SignInAzureAD } from "../../graphql/auth/mutation";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { getFirstTwoLetters, getRoutePath } from "../../utils/common";
import { loginRequest } from "../../config/authConfig";
import { addUser, selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppIds, userLocalStorageKey, UserRoles } from "../../utils/constants";
import Muibreadcrumb from "../BreadCrumbs";
import UnauthorizedUser from "../../pages/Unauthorized";
import { GLOBAL_SEARCH, GET_DATA_BY_ID } from "../../graphql/common/queries";
import AppBar from "../AppBar";
import NavBar from "../NavBar";

export const drawerWidth = 240;

export interface LayoutProps {
  children: React.ReactNode;
}

export type AdminMenuItemsType = {
  key: string;
  icon: JSX.Element;
  iconActive: JSX.Element;
  label: string;
};

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AdminMenuItems = [
  {
    key: getRoutePath(""),
    icon: <img src={dashboard} alt={"dashboard"} />,
    iconActive: (
      <img
        className="drawerMenuItem"
        src={dashboardActive}
        alt={"dashboard"}
        style={{ backgroundColor: "rgba(0, 85, 150, 0.08)" }}
      />
    ),
    label: "Dashboard",
  },
  {
    key: getRoutePath("/members"),
    icon: <img src={accountGroup} alt={"Members"} />,
    iconActive: (
      <img
        className="drawerMenuItem"
        src={accountGroupActive}
        alt={"Members"}
        style={{ backgroundColor: "rgba(0, 85, 150, 0.08)" }}
      />
    ),
    label: "Members",
  },
  {
    key: getRoutePath("/companies"),
    icon: <img src={company} alt={"companies"} />,
    iconActive: (
      <img
        className="drawerMenuItem"
        src={companyActive}
        alt={"companies"}
        style={{ backgroundColor: "rgba(0, 85, 150, 0.08)" }}
      />
    ),
    label: "Companies",
  },
];

export default function MiniDrawer(props: LayoutProps) {
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [signInLoading, setsignInLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  let navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElApp, setAnchorElApp] = useState<null | HTMLElement>(null);
  const settings = ["Profile", "Logout"];
  const { instance } = useMsal();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [search, setSearch] = useState("");
  const [res, setRes] = useState<Array<any>>([]);
  const [currentOption, setCurrentOption] = useState();

  const {
    data: searchResults,
    refetch: refetchSearchResults,
    error: searchResultsError,
    loading: searchLoading,
  } = useQuery(GLOBAL_SEARCH, {
    variables: {
      companySearchArg: {
        text: "",
        size: 10,
        page: 1,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const [
    signInAzureAD,
    {
      data: userSignInData,
      loading: userSignInLoading,
      error: userSignInError,
    },
  ] = useMutation(SignInAzureAD, {
    notifyOnNetworkStatusChange: true,
  });

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {
    if (searchResults && !searchResultsError && !searchLoading) {
      setRes(searchResults?.companySearch?.res);
    }
  }, [searchResults, searchResultsError, searchLoading]);

  const [getDataById, { data: queryData, loading: queryDataLoading }] =
    useLazyQuery(GET_DATA_BY_ID, {
      variables: {
        DataModelInput: {
          entity: "Company",
        },
        param: {
          id: Number(currentOption),
        },
      },
      notifyOnNetworkStatusChange: true,
    });
  useEffect(() => {
    if (!queryDataLoading && queryData) {
      let companyName = queryData?.GetDataById?.info?.name;
      let tempCompanytName = companyName.replace(/ /g, "");
      let tempGroupName = (currentOption as any)?.name.replace(/ /g, "");
      setSearch("");
      navigate(`/admin/companies/${tempCompanytName}/${tempGroupName}`, {
        state: { group: currentOption },
      });
    }
  }, [queryData, queryDataLoading]);

  const handleCloseUserMenu = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    if (value === "Logout") {
      handleLogout(instance);
    } else if (value === "Profile") {
      navigate("/admin/userprofile");
    }
    setAnchorElUser(null);
  };

  const handleOpenAppMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElApp(event.currentTarget);
  };

  const handleCloseAppMenu = () => {
    setAnchorElApp(null);
  };

  const isAdminUser = (roles: any[]): boolean => {
    if (roles && roles.length > 0) {
      if (
        roles.filter((role: any) => role.roleId === UserRoles.admin).length > 0
      )
        return true;
    }
    return false;
  };

  const isSuperAdminUser = (roles: any[]): boolean => {
    if (roles && roles.length > 0) {
      if (
        roles.filter((role: any) => role.roleId === UserRoles.super_admin)
          .length > 0
      )
        return true;
    }
    return false;
  };

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
                appId: AppIds.ADMIN,
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
      dispatch(addUser(userSignInData?.signInAzureAD));
      localStorage.setItem(
        userLocalStorageKey,
        JSON.stringify(userSignInData?.signInAzureAD)
      );
    }
    setsignInLoading(false);
  }, [userSignInData]);

  const handleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const getDefaultKey = () => {
    const currentPath = location.pathname;
    if (currentPath === getRoutePath("/")) {
      return [getRoutePath("/")];
    } else if (currentPath.startsWith(getRoutePath("/members"))) {
      return [getRoutePath("members")];
    } else if (currentPath.startsWith(getRoutePath("/companies"))) {
      return [getRoutePath("companies")];
    } else {
      return ["/"];
    }
  };
  const UserMenu = (
    <Box sx={{ flexGrow: 0, marginLeft: "20px" }}>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar
          sx={{
            bgcolor: "white",
            color: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.main}`,
            height: "35px",
            width: "35px",
          }}
        >
          <Typography>{getFirstTwoLetters(user?.user?.firstName)}</Typography>
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="user-menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingX: "14px",
          }}
          component={"div"}
        >
          <Typography>{user?.user?.firstName}</Typography>
          <Typography variant="body2">{user?.user?.email}</Typography>
        </Box>
        <Divider sx={{ marginY: "10px" }} />
        {settings.map((setting) => (
          <MenuItem
            key={setting}
            onClick={(ev) => handleCloseUserMenu(ev, setting)}
          >
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );

  const AppMenuItem = ({ title, image }: any) => {
    return (
      <IconButton
        href="https://www.zones.com/"
        target={"_blank"}
        className="app-menu-item-icon"
        disableRipple
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexDirection: "column",
          alignSelf: "center",
          padding: 2,
        }}
        color={"info"}
      >
        <img src={image} height={"25px"} width={"25px"} />
        <Typography
          width={"100%"}
          mt={"5px"}
          sx={{ fontWeight: "bold" }}
          variant="body2"
        >
          {title.toUpperCase()}
        </Typography>
      </IconButton>
    );
  };

  const AppMenu = (
    <Box sx={{ flexGrow: 0, marginLeft: "10px" }}>
      <IconButton onClick={handleOpenAppMenu} sx={{ p: 0 }}>
        <img src={AppSelectorIcon} height={"25px"} width={"25px"} />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="app-menu-appbar"
        anchorEl={anchorElApp}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElApp)}
        onClose={handleCloseAppMenu}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Grid width={"250px"} container spacing={0}>
            <Grid xs={6}>
              <AppMenuItem title={"Ecommerce"} image={ecommerceIcon} />
            </Grid>
            <Grid xs={6}>
              <AppMenuItem title={"Settings"} image={settingsIcon} />
            </Grid>
            <Grid xs={6}>
              <AppMenuItem title={"Merchandising"} image={merchandisingIcon} />
            </Grid>
            <Grid xs={6}>
              <AppMenuItem title={"ZDP-PIM"} image={pimAppIcon} />
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  );

  const handleEnter = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    setSearch((ev.currentTarget as HTMLInputElement).value);
    globalSearchNavigate(search);
  };

  const handleSearch = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch(ev.target.value);
    if (ev.target.value.length > 1) {
      refetchSearchResults({
        companySearchArg: { text: ev.target.value, size: 10, page: 1 },
      });
    } else if (ev.target.value == "") {
      refetchSearchResults({
        companySearchArg: { text: "", size: 10, page: 1 },
      });
    }
  };

  const globalSearchNavigate = (searchKey: any) => {
    {
      if (searchKey) {
        navigate(`/admin/search`, {
          state: {
            filteredData: res,
            searchKey,
          },
        });
      }
    }
  };

  const specificSearchNavigate = (option: any) => {
    setCurrentOption(option);
    setRes([]);
    if (option?.type === "company") {
      let tempCompanyName = option?.name.replace(/ /g, "");
      navigate(`/admin/companies/${tempCompanyName}`, {
        state: { company: option },
      });
    } else if (option?.type === "group") {
      getDataById({
        variables: {
          DataModelInput: {
            entity: "Company",
          },
          param: {
            id: Number(option?.companyId),
          },
        },
      });
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar open={open}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                paddingLeft: !open ? 60 : 0,
                display: "flex",
                height: "30px",
                color: "yellow",
              }}
            >
              <div style={{ display: "flex" }} className="pim-heading">
                <Typography>ADMIN</Typography>
              </div>
            </div>
            {user ? (
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <Autocomplete
                  freeSolo={true}
                  options={res ? res : []}
                  getOptionLabel={(option: any) =>
                    option?.name || option?.username || option?.email || ""
                  }
                  renderOption={(props, option: any) => {
                    return (
                      <Box
                        component="li"
                        {...props}
                        onClick={() => {
                          specificSearchNavigate(option);
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            width: "30px",
                            height: "30px",
                          }}
                        >
                          <Typography fontSize={"12px"}>
                            {getFirstTwoLetters(
                              option?.name ||
                                option?.firstName ||
                                option?.username ||
                                option?.email
                            )}
                          </Typography>
                        </Avatar>
                        <Box
                          sx={{
                            marginLeft: "10px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          component={"div"}
                        >
                          <Typography>
                            {option?.name ||
                              option?.firstName ||
                              option?.username ||
                              option?.email}
                          </Typography>
                          <Typography color={"GrayText"} variant="body2">
                            In {option?.type}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        variant="outlined"
                        {...params}
                        sx={{
                          "& label": {
                            paddingLeft: (theme) => theme.spacing(2),
                          },
                          "& input": {
                            paddingLeft: (theme) => theme.spacing(3.5),
                            marginLeft: "15px",
                          },
                          "& fieldset": {
                            paddingLeft: (theme) => theme.spacing(2),
                            borderRadius: "30px",
                            borderColor: "#D1D3D4",
                            marginLeft: "10px",
                            padding: "10px",
                          },
                        }}
                        label="Search for users, companies and groups"
                        placeholder="Search"
                        size="small"
                        onChange={(ev) => {
                          handleSearch(ev);
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter") {
                            handleEnter(ev);
                          }
                        }}
                      />
                    );
                  }}
                />
              </Box>
            ) : null}
            <div>
              {user ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {AppMenu} {UserMenu}
                </Box>
              ) : (
                <SignInButton />
              )}
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <NavBar
        open={open}
        adminMenuItems={AdminMenuItems}
        getDefaultKey={getDefaultKey()}
        handleDrawer={handleDrawer}
        hiddenMenuItem={[]}
      />
      {user ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          {isAdminUser(user.roles) || isSuperAdminUser(user.roles) ? (
            <>
              <DrawerHeader />
              <Muibreadcrumb />
              <Divider
                style={{
                  marginBottom: "10px",
                  paddingBottom: "10px",
                }}
              />
              {props.children}
            </>
          ) : (
            <UnauthorizedUser />
          )}
        </Box>
      ) : signInLoading ? (
        ""
      ) : (
        <Login />
      )}
    </Box>
  );
}
