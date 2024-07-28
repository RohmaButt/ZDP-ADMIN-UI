import { graphConfig } from "../config/authConfig";

/**
 * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
 */
export async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function callMsGetAllUsersGraph(accessToken: string, searchParam?: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(searchParam ? `${graphConfig.graphAllUsersEndpoint}?$filter=startsWith(displayName,'${searchParam}')` : graphConfig.graphAllUsersEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
