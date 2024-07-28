import React from "react";
import { Alert } from "antd";
import Input from "../external/InputText";

const marginTop = 20;

const GetInputField = (
  onChangeHandler: (
    key: string,
    value: any,
    option: any,
    index: number
  ) => void,
  fieldKey: string,
  index: number,
  fields: any[],
  value?: string | number
) => {
  const itemIndex = fields.findIndex((item: any) => item.name === fieldKey);
  const itemMetaData = fields[itemIndex].metadata;

  const handleOnChange = (ev: any) => {
    onChangeHandler("values", ev.target.value, undefined, index);
  };

  switch (itemMetaData.dataType) {
    case "string":
      return (
        <Input
          style={{ marginTop: marginTop }}
          onChange={handleOnChange}
          value={value}
          label={"Enter here"}
        />
      );
    case "integer":
      return (
        <Input
          style={{ marginTop: marginTop }}
          onChange={handleOnChange}
          value={value}
          label={"Enter value"}
          type={"number"}
        />
      );
    case "date":
      return (
        <Input
          style={{ marginTop: marginTop }}
          onChange={handleOnChange}
          label="Select date"
          type={"date"}
          value={value}
        />
      );
    case "date-time":
      return (
        <Input
          style={{ marginTop: marginTop }}
          onChange={handleOnChange}
          label="Select date-time"
          type={"datetime-local"}
          value={value}
        />
      );
    default:
      return (
        <Alert
          style={{ marginTop: marginTop }}
          message="Oops!"
          description={`Unable to get the desired input for ${itemMetaData.friendlyName}. Please contact system administrator.`}
          type="error"
        />
      );
  }
};

export default GetInputField;