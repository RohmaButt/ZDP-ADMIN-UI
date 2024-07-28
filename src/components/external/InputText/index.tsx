import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export type InputTextProps = {
  error?: boolean;
  errorText?: string;
  variant?: "standard" | "filled" | "outlined" | undefined;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  type?: any;
  value?: any;
  label?: string;
  size?: "small" | "medium" | undefined;
  style?: object;
  helperText?: string;
  startIcon?: any;
  step?: string;
  inputProps?: any;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: any;
  sx?: any;
};

function InputText(props: InputTextProps) {
  const {
    error,
    errorText,
    variant,
    onChange,
    type,
    value = "",
    label = "",
    size,
    style,
    helperText,
    startIcon,
    inputProps,
    className,
    sx,
  } = props;

  const onChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    onChange(ev);
  };

  const newProps = { ...props };
  delete newProps.errorText;

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        {...newProps}
        style={{ width: "100%", ...style }}
        error={error}
        helperText={error ? errorText : helperText}
        id="outlined-basic"
        label={label}
        variant={variant ? variant : "outlined"}
        onChange={onChangeHandler}
        type={type ? type : "text"}
        value={value}
        size={size ? size : "small"}
        inputProps={inputProps}
        className={className}
        sx={sx}
      />
    </Box>
  );
}

export default InputText;
