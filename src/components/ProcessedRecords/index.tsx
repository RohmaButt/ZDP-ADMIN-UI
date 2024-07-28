import React, { useEffect, useMemo, useState } from "react";
import "./index.css";
import { Card, Spin } from "antd";
import { useQuery } from "@apollo/client";
import { ColumnConfig } from "@ant-design/plots";
import { BarChart } from "..";
import moment from "moment";
import { GET_FILES_COUNT_GROUP_BY_DATE } from "../../graphql/dashboard/queries";
import FilterView, { FilterViewProps } from "../FilterView";
import {
  defaultFilterInput,
  defaultPaginationParams,
} from "../../utils/constants";
import { useTheme } from "@mui/material/styles";
import BarChartStyles from "../BarChart/index.styles";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IconButton from "@mui/material/IconButton";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../NotificationContent";
import { Tooltip } from "@mui/material";

const ProcessedRecords = ({
  onClose,
  visible,
  showDrawer,
}: FilterViewProps) => {
  const [filters, setFilters] = useState("{}");
  const theme = useTheme();
  const { loading, error, data, refetch } = useQuery(
    GET_FILES_COUNT_GROUP_BY_DATE,
    {
      variables: {
        pagination: { ...defaultPaginationParams },
        filterInput: { ...defaultFilterInput },
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  // useEffect(() => {
  //   if (error) {
  //     Store.addNotification({
  //       content: (
  //         <NotificationContent
  //           type={"danger"}
  //           title={"Error"}
  //           message={error.message}
  //         />
  //       ),
  //       ...notificationOptions,
  //     });
  //   }
  // }, [error]);

  const config: ColumnConfig = useMemo(() => {
    return {
      data: loading
        ? []
        : error
        ? []
        : data.EdiFeedStatisticGroupByDateColumn?.data,
      xField: "processingDate",
      yField: "count",
      xAxis: {
        label: {
          formatter(text: string) {
            return moment(text).format("Do MMM, YY");
          },
        },
      },
      ...BarChartStyles,
    };
  }, [loading, error, data]);

  const onRun = (filter: string) => {
    setFilters(filter);
    refetch({
      pagination: { ...defaultPaginationParams },
      filterInput: { filterInputString: filter },
    });
  };

  return (
    <Card
      title="Records Processed"
      extra={
        <Tooltip title={"Filters"}>
          <IconButton
            onClick={() => showDrawer && showDrawer()}
            style={{
              color: filters !== "{}" ? theme.palette.primary.main : undefined,
            }}
          >
            <FilterAltOutlinedIcon />
          </IconButton>
        </Tooltip>
      }
      size={"small"}
    >
      <Spin className="spinner" tip={"Loading.."} spinning={loading} />
      <BarChart config={config} />
      <FilterView
        onRun={onRun}
        onClose={onClose}
        visible={visible}
        defaultComponentValue={"processedRecords"}
        defaultComponentTitle={"Processed Records"}
      />
    </Card>
  );
};

export default ProcessedRecords;
