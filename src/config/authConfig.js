export const msalConfig = {
  auth: {
    clientId: "c92371f8-71e0-4fcc-bef9-d0d0dd501531",
    authority:
      "https://login.microsoftonline.com/d8660806-f38d-4ca0-a6f1-8deb7cfe8971", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: process.env.REACT_APP_AZURE_REDIRECT_UI,
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// APP ID URI of the web API project that you've registered e.g. api://xxxxxx/access_as_user
const webApiScope = "api://fe9ccb67-64bb-4b47-80cf-a0caa30ab9d4/access_as_user"; //process.env.REACT_APP_WEB_API_SCOPE; // Web_Api_Scope
const graphMeEndpoint = "https://graph.microsoft.com/v1.0/me";
const graphAllUsersEndpoint = "https://graph.microsoft.com/v1.0/users";

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: [webApiScope, "User.Read"],
};

export const getAllUsersRequest = {
  scopes: ["User.ReadBasic.All"],
};

export const protectedResources = {
  graphMe: {
    endpoint: graphMeEndpoint,
    scopes: ["User.Read"],
  },
  grahpUsers: {
    endpoint: graphAllUsersEndpoint,
    scopes: ["User.ReadBasic.All"],
  },
  pimApi: {
    endpoint: process.env.REACT_APP_BACKEND_URL,
    scopes: [webApiScope],
  },
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphAllUsersEndpoint: "https://graph.microsoft.com/v1.0/users",
};
