import React from "react";
import { useMsal } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { Button } from "../index";
import { userLocalStorageKey } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../../features/user/userSlice";

export function handleLogout(instance: IPublicClientApplication) {
  localStorage.removeItem(userLocalStorageKey);
  instance.logoutRedirect().catch((e) => {
    console.error(e);
  });
}

export function handleSilentLogout(instance: IPublicClientApplication) {
  localStorage.removeItem(userLocalStorageKey);
  instance.logoutPopup().catch((e) => {
    console.error(e);
  });
}

/**
 * Renders a button which, when selected, will redirect the page to the login prompt
 */
const SignOutButton = () => {
  const { instance } = useMsal();
  const dispatch = useDispatch();

  const handleLogout = (instance: IPublicClientApplication) => {
    localStorage.removeItem(userLocalStorageKey);
    dispatch(removeUser());
    instance.logoutRedirect().catch((e) => {
      console.error(e);
    });
  };

  return (
    <Button type="primary" onClick={() => handleLogout(instance)}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
