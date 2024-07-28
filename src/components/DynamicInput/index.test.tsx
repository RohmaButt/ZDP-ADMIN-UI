import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TestProviders from "../../providers/testProviders";
import GetInputField from "./index";

const fields = [
  {
    name: "id",
    metadata: {
      friendlyName: "Id",
      dataType: "integer",
      isFilterable: true,
      isSortable: true,
      isRequired: true,
    },
  },
  {
    name: "name",
    metadata: {
      friendlyName: "Name",
      dataType: "string",
      isFilterable: true,
      isSortable: true,
      isRequired: true,
    },
  },
  {
    name: "modifiedAt",
    metadata: {
      friendlyName: "Modified At",
      dataType: "date-time",
      isFilterable: true,
      isSortable: true,
      isRequired: true,
    },
  },
  {
    name: "dateOnly",
    metadata: {
      friendlyName: "Modified At",
      dataType: "date",
      isFilterable: true,
      isSortable: true,
      isRequired: true,
    },
  },
  {
    name: "wrongInput",
    metadata: {
      friendlyName: "Wrong Input",
      dataType: "wrongType",
      isFilterable: true,
      isSortable: true,
      isRequired: true,
    },
  },
];

describe("Dynamic Input", () => {
  it("Should return the error element if no dataType matches", async () => {
    render(GetInputField(() => null, "wrongInput", 4, fields, undefined));
    const ErrorElement = screen.getByText(/Oops!/i);
    expect(ErrorElement).toBeInTheDocument();
  });

  it("Should return the text input", async () => {
    render(GetInputField(() => null, "name", 1, fields, undefined));
    const DateTimeElemet = screen.getByLabelText(/Enter here/i);
    expect(DateTimeElemet).toBeInTheDocument();
  });

  it("Should return the number input", async () => {
    render(GetInputField(() => null, "id", 0, fields, undefined));
    const DateTimeElemet = screen.getByLabelText(/Enter value/i);
    expect(DateTimeElemet).toBeInTheDocument();
  });

  it("Should return the date time field", async () => {
    render(GetInputField(() => null, "modifiedAt", 2, fields, undefined));
    const DateTimeElemet = screen.getByLabelText(/Select date-time/i);
    expect(DateTimeElemet).toBeInTheDocument();
  });

  it("Should return the date only input", async () => {
    render(GetInputField(() => null, "dateOnly", 3, fields, undefined));
    const DateElemet = screen.getByLabelText(/Select date/i);
    expect(DateElemet).toBeInTheDocument();
  });
});
