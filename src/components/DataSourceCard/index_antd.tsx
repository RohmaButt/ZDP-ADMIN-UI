import { Card, Typography } from "antd";
import { defaultThemeColor } from "../../utils/colors";
import "./index.css";
import { ApolloError } from "@apollo/client";
import React from "react";

const { Text } = Typography;

export type DataSourceCardProps = {
  extra?: React.ReactNode;
  description: string;
  title: string;
  feeds?: number;
  records: number;
  style?: React.CSSProperties;
  loading?: boolean;
  error?: ApolloError | undefined;
  onClick?: () => void;
};

const DataSourceCard = (props: DataSourceCardProps) => {
  const {
    description,
    title,
    feeds = 0,
    records = 0,
    extra,
    style,
    loading,
    error,
    onClick,
  } = props;

  const onClickHandler = (ev: any) => {
    onClick && onClick();
  };

  return (
    <Card
      title={title}
      extra={extra}
      style={{ minWidth: 400, ...style }}
      className={"blog-shadow-dreamy card"}
      loading={loading}
      onClick={onClickHandler}
    >
      {error ? (
        <Text>Something went wrong!</Text>
      ) : (
        <>
          <Text className="card-description">{description}</Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
            {feeds !== 0 ? (
              <Text className="card-fonts">
                Total Feeds:
                <Text style={{ color: defaultThemeColor, marginLeft: "26px" }}>
                  {feeds}
                </Text>
              </Text>
            ) : null}
            <Text className="card-fonts">
              Total Records:
              <Text style={{ color: defaultThemeColor, marginLeft: "15px" }}>
                {records}
              </Text>
            </Text>
          </div>
        </>
      )}
    </Card>
  );
};

export default DataSourceCard;
