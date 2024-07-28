import React, { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type IProps = {
  children: ReactNode;
  variant?: any;
  [key: string]: any; // Allow any other additional props
};

export default function TypographyComponent({
  children,
  variant,
  ...otherProps
}: IProps) {
  return (
    <Typography variant={variant} {...otherProps}>
      {children}
    </Typography>
  );
}

TypographyComponent.defaultProps = {
  children: <></>,
  variant: 'h4',
};
