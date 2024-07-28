import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type MenuItemType = {
  label: string;
  value: string;
  dto?: string;
};

type BasicSelectPropType = {
  label: string;
  onChange?: (value: string, item?: any | undefined) => void;
  menuItems: Array<any>;
  size?: "small" | "medium" | undefined;
  formStyle?: object;
  defaultValue?: string;
  value?: string;
  labelKey?: string;
  hasNestedLabel?: boolean;
  disabled?: boolean;
  nestedLabelKey?: string;
  valueKey?: string;
  isLoading?: boolean;
};

export default function BasicSelect({
  label,
  onChange,
  menuItems = [],
  size,
  formStyle,
  value,
  valueKey,
  labelKey,
  isLoading = false,
  hasNestedLabel = false,
  nestedLabelKey = "",
  disabled = false,
  defaultValue,
}: BasicSelectPropType) {
  const handleChange = (event: SelectChangeEvent, item: any) => {
    onChange && onChange(event.target.value as string, item);
  };

  const labelKeyName = labelKey ? labelKey : "label";
  const valueKeyName = valueKey ? valueKey : "value";

  return (
    <Box>
      <FormControl
        fullWidth
        style={{ minWidth: 120, ...formStyle }}
        size={size ? size : "small"}
      >
        <InputLabel aria-label={`${label}`}>{label}</InputLabel>
        <Select
          defaultValue={defaultValue}
          value={value}
          label={label}
          disabled={disabled}
          onChange={handleChange}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={`${labelKeyName}-${valueKeyName}-${index}`}
              value={item[valueKeyName]}
            >
              {hasNestedLabel
                ? item[labelKeyName][nestedLabelKey]
                : item[labelKeyName]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
