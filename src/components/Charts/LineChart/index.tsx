import React, {useMemo} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material';

type LineChartProps = {
  data: Array<any>;
  dataKey: string;
  dataKeyX?: string;
  title?: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App(props: LineChartProps) {
  const theme = useTheme();
  const options = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Line Chart",
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
          label: props.title,
          data: props.data,
          backgroundColor: theme.palette.primary.dark,
          borderColor: theme.palette.primary.light
        },
      ],
    };
  }, [props.data, props.title]);

  return <Line options={options} data={data} redraw={true} />;
}
