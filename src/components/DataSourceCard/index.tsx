import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { ApolloError } from "@apollo/client";
import Divider from "../external/Divider";
import { Box, useTheme } from "@mui/material";
import "./index.css";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

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

export default function RecipeReviewCard(props: DataSourceCardProps) {
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

  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      className="card"
      sx={{ minWidth: "400px", maxWidth: "400px", ...style }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: "16px",
          paddingY: "10px",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" fontWeight={550}>
          {title}
        </Typography>
        {extra}
      </Box>
      <Divider style={{ marginTop: "0px", marginBottom: "5px" }} />
      <CardContent>
        <Typography fontSize={12} variant="body2" fontWeight={550}>
          {description}
        </Typography>
      </CardContent>
      <CardContent className="card-fonts" sx={{ paddingTop: 1 }}>
        {feeds !== 0 ? (
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            variant="body2"
          >
            Total Feeds:
            <Typography
              variant="body2"
              sx={{ color: theme.palette.primary.main, marginLeft: "26px" }}
            >
              {feeds}
            </Typography>
          </Typography>
        ) : null}
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          variant="body2"
        >
          Total Records:
          <Typography
            variant="body2"
            sx={{ color: theme.palette.primary.main, marginLeft: "14px" }}
          >
            {records}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
