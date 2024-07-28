import React, { useMemo } from "react";
import { useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

type BarChartProps = {
  data: Array<any>;
  dataKey: string;
  dataKeyX?: string;
  title?: string;
  datasetLabel?: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart(props: BarChartProps) {
  const theme = useTheme();
  const {title} = props;

  const options = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: title ? true : false,
          text: title ? title : "Bar Chart",
        },
      },
      parsing: {
        xAxisKey: props.dataKeyX,
        yAxisKey: props.dataKey,
      },
    };
  }, [props.dataKeyX, props.dataKey]);

  const data = useMemo(() => {
    return {
      datasets: [
        {
          label: props.datasetLabel ? props.datasetLabel : "",
          data: props.data,
          backgroundColor: theme.palette.primary.light,
        },
      ],
    };
  }, [props.data, props.title]);

  return <Bar options={options} data={data} redraw={true} />;
}
