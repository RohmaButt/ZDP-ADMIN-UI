import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  ChartData,
} from "chart.js";
import { Chart, Doughnut, Pie } from "react-chartjs-2";
import { useTheme } from "@mui/material";

type DoughnutProps = {
  data: Array<any>;
  labels: Array<any>;
  backgroundColor: Array<any>;
};

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export default function App(props: DoughnutProps) {
  const theme = useTheme();
  const options = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          dispaly: true,
          position: "right" as "right",
          // rtl: true,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            font: {
              weight: "bold",
            },

            // generateLabels: function (chart: any) {
            //   const labels = [
            //     {
            //       text: "dsfd<h1>ff</h1>",
            //       fontColor: "red",
            //       fillStyle: "black",
            //       borderRadius: 20,
            //     },
            //   ];
            //   return labels;
            // },
          },
        },
      },
    };
  }, [props.data, props.labels]);

  const data: ChartData<"doughnut", number[], unknown> = useMemo(() => {
    return {
      labels: props.labels && props.labels.length > 0 ? props.labels : [],
      datasets: [
        {
          data: props.data,
          backgroundColor: props.backgroundColor,
        },
      ],
    };
  }, [props.data, props.labels]);

  return <Doughnut options={options} data={data} redraw={true} />;
}
