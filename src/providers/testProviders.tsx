import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../app/store";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { graphqlMocks } from "../graphql/mock_data";
import { ThemeProvider } from "@mui/material";
import theme from "../mui.theme";
import React from "react";

interface Props {
  children: ReactNode;
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GraphQL_Server,
  cache: new InMemoryCache(),
});

const TestProviders: FC<Props> = ({ children }) => (
  <MockedProvider mocks={graphqlMocks} addTypename={false}>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    </Provider>
  </MockedProvider>
);

export default TestProviders;
