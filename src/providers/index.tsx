import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../app/store";
import { msalConfig } from "../config/authConfig";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import theme from "../mui.theme";
import { ThemeProvider } from "@mui/material/styles";
import { userLocalStorageKey } from "../utils/constants";
import { onError } from "@apollo/client/link/error";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../components/NotificationContent";
import messages from "../locales/en/messages.json";
import { handleSilentLogout } from "../components/SignOutButton";
import React from "react";

interface Props {
  children: ReactNode;
}

interface Messages {
  [key: string]: string;
}

const msalInstance = new PublicClientApplication(msalConfig);

const handle401 = () => {
  handleSilentLogout(msalInstance);
};

const AsyncTokenLookup = async () => {
  const user = localStorage.getItem(userLocalStorageKey);
  if (user) {
    const userObj = JSON.parse(user);
    return userObj.auth_token;
  } else {
    return null;
  }
};

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GraphQL_Server,
});

export const logoutLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, extensions }: any) => {
      if (message === "Unauthorized") {
        handle401();
      } else if (extensions.exception) {
        let matchedValue: string = (messages as Messages)[
          extensions?.exception?.response?.key
        ];
        Store.addNotification({
          content: (
            <NotificationContent
              type={"danger"}
              message={
                extensions?.exception?.response?.field
                  ? matchedValue.replace(
                      "{field}",
                      extensions?.exception?.response?.field
                    )
                  : matchedValue
              }
            />
          ),
          ...notificationOptions,
        });
      } else if (message.includes("ConnectionError: connect ECONNREFUSED")) {
      } else {
        Store.addNotification({
          content: (
            <NotificationContent
              type={"danger"}
              message={messages.generalMessage}
            />
          ),
          ...notificationOptions,
        });
      }
    });
  }
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncTokenLookup();
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

export const client = new ApolloClient({
  link: from([authLink, logoutLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const pimHttpLink = createHttpLink({
  uri: process.env.REACT_APP_GraphQL_PIM_Server,
});

export const pimClient = new ApolloClient({
  link: from([authLink, logoutLink, pimHttpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

const Providers: FC<Props> = ({ children }) => (
  <MsalProvider instance={msalInstance}>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </MsalProvider>
);

export default Providers;
