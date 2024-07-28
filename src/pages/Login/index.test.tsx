import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "./index";
import TestProviders from "../../providers/testProviders";

describe("Login page", () => {
  it("Should return the Login page", async () => {
    render(
      <TestProviders>
        <Login />
      </TestProviders>
    );
    const TextElement = screen.getByText(
      /You are not signed in! Please sign in to continue./i
    );
    expect(TextElement).toBeInTheDocument();
  });
});
