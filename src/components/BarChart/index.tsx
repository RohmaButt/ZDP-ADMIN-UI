import React, { FC, Suspense, lazy } from "react";
import { ColumnConfig } from "@ant-design/plots";

type BarChartProps = {
  config: ColumnConfig;
  height?: string;
};

const BarChart: FC<BarChartProps> = ({ config, height = "300px" }) => {
  if (process.env.NODE_ENV !== "test") {
    const Column = lazy(
      () => import("@ant-design/plots/lib/components/column")
    );
    return (
      <Suspense fallback={<div />}>
        <Column style={{ height: height }} {...config} />
      </Suspense>
    );
  }

  return <div></div>;
};

export default BarChart;
