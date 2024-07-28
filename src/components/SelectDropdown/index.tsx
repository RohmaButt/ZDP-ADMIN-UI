import React, { FC } from "react";
import { Select } from "antd";

const { Option } = Select;

type SelectDropdownProps = {
  onChange: (value: string, option: any) => void;
  options: any[];
  styles?: Object;
  placeHolder?: string;
  valueKey?: string;
  labelKey?: string;
  isLoading?: boolean;
  hasNestedLabel?: boolean;
  nestedLabelKey?: string;
  disabled?: boolean;
  defaultValue?: string;
  allowClear?: boolean;
};

const SelectDropdown: FC<SelectDropdownProps> = ({
  onChange,
  options = [],
  valueKey,
  labelKey,
  styles,
  placeHolder = "Select",
  isLoading = false,
  hasNestedLabel = false,
  nestedLabelKey = "",
  disabled = false,
  defaultValue = null,
  allowClear = false,
}) => {
  const handleChange = (value: string, option: any) => {
    onChange(value, option);
  };

  const labelKeyName = labelKey ? labelKey : "label";
  const valyeKeyName = valueKey ? valueKey : "value";

  return (
    <Select
      onChange={handleChange}
      placeholder={placeHolder}
      style={{ width: "100%", ...styles }}
      loading={isLoading}
      allowClear={allowClear}
      disabled={disabled}
      defaultActiveFirstOption={true}
      defaultValue={defaultValue ? defaultValue : null}
    >
      {options.map((item, index) => {
        return (
          <Option
            key={`${labelKeyName}-${valyeKeyName}-${index}`}
            value={item[valyeKeyName]}
          >
            {hasNestedLabel
              ? item[labelKeyName][nestedLabelKey]
              : item[labelKeyName]}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectDropdown;
