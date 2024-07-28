import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import TestProviders from "../../providers/testProviders";
import FilterView from ".";

describe("Filter View", () => {
  it("Should render the Filter View with children", async () => {
    render(
      <TestProviders>
        <FilterView
          visible={true}
          onClose={() => {}}
          defaultComponentValue={"processedRecords"}
        />
      </TestProviders>
    );
    const TextElements = await screen.findAllByText(/Filters/i);
    expect(TextElements.length).toBe(2);
  });

  it("Should add the fields for condition", async () => {
    render(
      <TestProviders>
        <FilterView
          visible={true}
          onClose={() => {}}
          defaultComponentValue={"processedRecords"}
        />
      </TestProviders>
    );

    const AddButtonElement = await screen.findByPlaceholderText(
      /Add Condition/i
    );

    expect(AddButtonElement).toBeInTheDocument();

    act(() => {
      fireEvent.click(AddButtonElement);
    });

    const SelectFieldElement = await screen.findByLabelText(/Field/i);
    const SelectConditionElement = await screen.findByLabelText(/Condition/i);

    expect(SelectFieldElement).toBeInTheDocument();
    expect(SelectConditionElement).toBeInTheDocument();
  });

  it("Should delete the fields for condition", async () => {
    render(
      <TestProviders>
        <FilterView
          visible={true}
          onClose={() => {}}
          defaultComponentValue={"processedRecords"}
        />
      </TestProviders>
    );

    const AddButtonElement = await screen.findByPlaceholderText(
      /Add Condition/i
    );
    expect(AddButtonElement).toBeInTheDocument();
    act(() => {
      fireEvent.click(AddButtonElement);
    });

    const DeleteButtonElement = await screen.findByPlaceholderText(
      /Condition delete button/i
    );
    expect(DeleteButtonElement).toBeInTheDocument();
    act(() => {
      fireEvent.click(DeleteButtonElement);
    });

    expect(screen.queryByLabelText(/Field/i)).toBeNull();
    expect(screen.queryByLabelText(/Condition/i)).toBeNull();
  });
});
