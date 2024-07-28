import React from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addUser } from "../../features/user/userSlice";
import EditIcon from "@mui/icons-material/Edit";
import InputText from "../../components/external/InputText";
import { UpdateUser } from "../../graphql/users/mutations";
import { useMutation } from "@apollo/client";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";
import { SignInAzureAD } from "../../graphql/auth/mutation";
import { useMsal } from "@azure/msal-react";
import { AppIds, userLocalStorageKey } from "../../utils/constants";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../../config/authConfig";

export type UserProfileDetailsProps = {
  user: UserData | null;
};

export type UserApplicationProps = {
  user: UserData | null;
  userRequestsByStatusData: any;
  refetchUserRequestByStatusData: () => void;
};

const UserProfileDetails = ({ user }: UserProfileDetailsProps) => {
  const [profileImageFile, setProfileImageFile] = useState("");
  const [profileImage64, setProfileImage64] = useState("");
  const [file, setFile] = useState("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [fileMetaData, setFileMetaData] = useState<any>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("Zones");
  const [isDisabled, setIsDisabled] = useState(true);
  const { instance } = useMsal();
  const dispatch = useAppDispatch();

  const getFile = (file: string, fileobj: File | null) => {
    setFile(file);
    setFileMetaData({
      fileName: fileobj?.name,
      fileType: fileobj?.type,
    });
    setFileObj(fileobj);
  };

  const getBase64 = (file: File) => {
    convertBase64(file)
      .then((result: any) => {
        setProfileImage64(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const convertBase64 = (file: File) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL: any = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const [
    updateUserMutation,
    { data: updateUserRes, loading: updateUserLoading, error: updateUserError },
  ] = useMutation(UpdateUser);

  const handleDone = () => {
    updateUserMutation({
      variables: {
        param: { id: +user?.id! },
        input: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          profilePic: profileImage64,
        },
      },
    });
  };

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

  const getAccessToken = async () => {
    try {
      const accountInfo = instance.getAllAccounts()[0];
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

  useEffect(() => {
    if (!updateUserError && updateUserRes) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Record created successfully."}
          />
        ),
        ...notificationOptions,
      });
      getAccessToken();
      setIsDisabled(true);
      setFileMetaData({});
    }
    // else if (updateUserError) {
    //   Store.addNotification({
    //     content: (
    //       <NotificationContent
    //         type={"danger"}
    //         message={"Unable to update the Record. Please try again later."}
    //       />
    //     ),
    //     ...notificationOptions,
    //   });
    // }
  }, [updateUserRes, updateUserError]);

  useEffect(() => {
    if (userSignInData) {
      dispatch(addUser(userSignInData?.signInAzureAD));
      localStorage.setItem(
        userLocalStorageKey,
        JSON.stringify(userSignInData?.signInAzureAD)
      );
    }
  }, [userSignInData]);

  useEffect(() => {
    setFirstName(user?.user?.firstName!);
    setLastName(user?.user?.lastName!);
    setEmail(user?.user?.email!);
    setProfileImageFile(user?.user?.profilePic!);
  }, [user, userSignInData]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex" }}>
        <Box style={{ width: "88%" }}>
          <Typography
            variant="h6"
            sx={{ textTransform: "uppercase", marginLeft: "12%" }}
          >
            Basic Details
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={(ev) => setIsDisabled(false)}>
            <EditIcon />{" "}
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ display: "flex", marginTop: "20px", width: "80%" }}>
          <Box style={{ width: "20%" }}>
            <Box
              sx={{ display: "flex", justifyContent: "left", marginLeft: "7%" }}
            >
              <Avatar
                alt="C"
                src={profileImageFile}
                sx={{
                  width: "100px",
                  height: "100px",
                  border: "4px solid #005596",
                }}
              ></Avatar>
            </Box>
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "left",
              }}
            >
              <input
                disabled={isDisabled}
                style={{ display: "none" }}
                id="contained-button-file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  e?.target?.files &&
                    getFile(e.target.value, e.target.files[0]);
                  e?.target?.files &&
                    setProfileImageFile(URL.createObjectURL(e.target.files[0]));
                  e?.target?.files && getBase64(e.target.files[0]);
                }}
              />
              <label
                htmlFor="contained-button-file"
                style={
                  isDisabled
                    ? {
                        color: "#aaa",
                        // border: "1px solid #878787",
                        padding: "3px 20px",
                        borderRadius: "16px",
                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                      }
                    : {
                        color: "#878787",
                        border: "1px solid #878787",
                        padding: "3px 20px",
                        borderRadius: "16px",
                      }
                }
              >
                {fileMetaData.fileName ? fileMetaData.fileName : "Upload Image"}
              </label>
            </Box>
          </Box>
          <Box style={{ width: "80%" }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width: "49%", marginRight: "2%" }}>
                <InputText
                  disabled={isDisabled}
                  onChange={(e) => setFirstName(e.target.value)}
                  label="First Name"
                  value={firstName}
                />
              </Box>
              <Box sx={{ width: "49%" }}>
                <InputText
                  disabled={isDisabled}
                  onChange={(e) => setLastName(e.target.value)}
                  label="Last Name"
                  value={lastName}
                />
              </Box>
            </Box>
            <Box mt={"20px"}>
              <InputText
                disabled={isDisabled}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                value={email}
              />
            </Box>
            <Box mt={"20px"}>
              <InputText
                disabled={true}
                onChange={(e) => setCompanyName(e.target.value)}
                label="Company"
                value={companyName}
              />
            </Box>
            <Box mt={"20px"} sx={{ display: "flex", justifyContent: "right" }}>
              {updateUserLoading ? (
                <CircularProgress size={"20px"} sx={{ marginRight: "15px" }} />
              ) : (
                <Button
                  disabled={firstName && email && !isDisabled ? false : true}
                  style={
                    firstName && email && !isDisabled
                      ? {
                          borderRadius: "25px",
                          borderColor: "#005596",
                          color: "white",
                          backgroundColor: "#005596",
                        }
                      : { borderRadius: "25px" }
                  }
                  variant="contained"
                  size="small"
                  onClick={() => handleDone()}
                >
                  Update
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileDetails;

export type UserData = {
  auth_token: string;
  id: number;
  roles: Array<any>;
  user: User;
};

export type User = {
  authenticationType: string;
  email: string;
  externalUserId: string;
  firstName: string;
  lastName: string;
  id: number;
  isActive: boolean;
  userName: string;
  profilePic: string;
};
