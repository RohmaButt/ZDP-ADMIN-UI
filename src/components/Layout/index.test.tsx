import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import Layout from "./index";
import TestProviders from "../../providers/testProviders";
import {
  Configuration,
  IPublicClientApplication,
  PublicClientApplication,
} from "@azure/msal-browser";
import { TEST_CONFIG } from "../../config/testConfig";
import { MsalProvider } from "@azure/msal-react";

describe("Layout HOC", () => {
  let pca: IPublicClientApplication;
  const msalConfig: Configuration = {
    auth: {
      clientId: TEST_CONFIG.MSAL_CLIENT_ID,
    },
  };

  beforeEach(() => {
    pca = new PublicClientApplication(msalConfig);
  });

  afterEach(() => {
    // cleanup on exiting
    jest.clearAllMocks();
  });

  it("Show child component if account is signed in", async () => {
    const handleRedirectSpy = jest.spyOn(pca, "handleRedirectPromise");
    render(
      <MsalProvider instance={pca}>
        <TestProviders>
          <Layout>
            <span> A user is authenticated!</span>
          </Layout>
        </TestProviders>
      </MsalProvider>
    );

    await waitFor(() => expect(handleRedirectSpy).toHaveBeenCalledTimes(1));
    expect(
      screen.queryByText("A user is authenticated!")
    ).not.toBeInTheDocument();
  });

  it("Show Login component if user is unathurized", async () => {
    const handleRedirectSpy = jest.spyOn(pca, "handleRedirectPromise");
    render(
      <MsalProvider instance={pca}>
        <TestProviders>
          <Layout>
            <div>Hi</div>
          </Layout>
        </TestProviders>
      </MsalProvider>
    );
    await waitFor(() => expect(handleRedirectSpy).toHaveBeenCalledTimes(1));
    const TextElement = screen.getByText(
      /You are not signed in! Please sign in to continue./i
    );

    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
    expect(TextElement).toBeInTheDocument();
  });
});
