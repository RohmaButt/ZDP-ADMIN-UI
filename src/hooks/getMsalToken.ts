import { AuthenticationResult } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import React, { useEffect, useState } from "react";
import { protectedResources } from "../config/authConfig";

const useMsalToken = () => {
  const [token, settoken] = useState<string>("");
  const [loading, setloading] = useState(true);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const request = {
      scopes: protectedResources.pimApi.scopes,
      account: accounts[0],
    };

    instance
      .acquireTokenSilent(request)
      .then(async (response: AuthenticationResult) => {
        settoken(`Bearer ${response.accessToken}`);
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then(async (response) => {});
      });
  }, [token]);

  return [loading, token];
};

export default useMsalToken;
