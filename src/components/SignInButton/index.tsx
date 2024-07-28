import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../config/authConfig";
import { IPublicClientApplication } from "@azure/msal-browser";
import { Button } from "../index";
import { CircularProgress } from "@mui/material";

async function handleLogin(instance: IPublicClientApplication) {
  try {
    await instance.loginRedirect(loginRequest);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Renders a button which, when selected, will redirect the page to the login prompt
 */
const SignInButton = (props: any) => {
  const { instance } = useMsal();

  return (
    <Button
      sx={{ minWidth: "80px" }}
      variant="contained"
      onClick={() => handleLogin(instance)}
    >
      {props.loading ? (
        <CircularProgress color="secondary" size={"18px"} />
      ) : (
        "Sign in"
      )}
    </Button>
  );
};

export default SignInButton;
