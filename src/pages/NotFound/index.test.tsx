import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "./index";

describe("404 NotFound page", () => {
  it("Should return the 404 NotFound page", async () => {
    render(<NotFound />);
    const TextElement = screen.getByText(
      /Sorry, the page you visited does not exist./i
    );
    expect(TextElement).toBeInTheDocument();
  });
});
