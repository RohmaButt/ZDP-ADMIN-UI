import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { AuthenticationResult } from "@azure/msal-browser";

const RequestAccessToken = async () => {
  const { instance, accounts, inProgress } = useMsal();

  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  // Silently acquires an access token which is then attached to a request for Microsoft Graph data
  instance
    .acquireTokenSilent(request)
    .then((response: AuthenticationResult) => {
      return response.accessToken;
    })
    .catch((e) => {
      instance.acquireTokenPopup(request).then((response) => {
        return response.accessToken;
      });
    });
};

export { RequestAccessToken };
