import React, { FC } from "react";
import { Typography } from "antd";

const { Title } = Typography;

const Login: FC = () => {
  return (
    <Title level={4}>You are not signed in! Please sign in to continue.</Title>
  );
};

export default Login;
