import React from "react";
import { render, screen } from "@testing-library/react";
import DataSourceCard from "./index_antd";
import { DataSourceCardProps } from "./index_antd";

const CardData: DataSourceCardProps = {
  title: "Card Title",
  description: "Card Description",
  feeds: 2,
  records: 300,
};

describe("Data Source Card", () => {
  it("Should render the Card with provided Props", async () => {
    render(<DataSourceCard {...CardData} />);

    const title = screen.getByText(/Card Title/i);
    const description = screen.getByText(/Card Description/i);
    const feeds = screen.getByText(/2/i);
    const records = screen.getByText(/300/i);

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(feeds).toBeInTheDocument();
    expect(records).toBeInTheDocument();
  });
});
