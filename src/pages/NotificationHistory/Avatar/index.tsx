import * as React from 'react';
import Avatar from '@mui/material/Avatar';
type IProps = {
  children: React.ReactNode;
  [key: string]: any; // Allow any other additional props
};
export default function AvatarComponent({ children, ...otherProps }: IProps) {
  return <Avatar {...otherProps}>{children}</Avatar>;
}
AvatarComponent.defaultProps = {
  children: <></>,
};
