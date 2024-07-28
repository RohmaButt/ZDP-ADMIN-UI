import React, {useMemo} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, ChartData  } from 'chart.js';
import { Pie } from 'react-chartjs-2';

type PieChartProps = {
    data: Array<any>;
    dataKey: string;
    nameKey: string;
    title?: string;
}

ChartJS.register(ArcElement, Tooltip, Legend, Colors );

export default function App(props: PieChartProps) {
  const options = useMemo(() => {
    return {
      parsing: {
       key: props.dataKey
      },
    };
  }, [props.dataKey]);

  const labels = useMemo(() => {
    return props.data.map((i: any) => i[props.nameKey])
  }, [props.data, props.nameKey]);

  const data: ChartData<"pie", number[], unknown> = useMemo(() => {
    return {
      labels: props.nameKey ? labels : [],
      datasets: [
        {
          label: props.title,
          data: props.data,
        },
      ],
    };
  }, [props.data, props.title, labels]);

  return <Pie options={options} data={data} redraw={true} />;
}
