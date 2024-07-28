import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./index";
import TestProviders from "../../providers/testProviders";

describe("Home page", () => {
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: function () {},
          removeListener: function () {},
        };
      };
  });

  it("Should render the Dashboard", async () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );
    const TextElement = await screen.findByText(/Dashboard/i);
    expect(TextElement).toBeInTheDocument();
  });

  it("Should render the BarChart", async () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );
    const TextElements = await screen.findAllByText(/Records Processed/);
    expect(TextElements.length).toBe(1);
  });
});
