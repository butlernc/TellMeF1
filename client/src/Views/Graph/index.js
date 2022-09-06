import React from "react";
import { VictoryLine, VictoryChart, VictoryTheme } from "victory";
import GraphTitle from "./components/Title";

export default function Graph() {
  const data = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
  ];

  return (
    <div className="graph">
      <GraphTitle />
      <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={data}
        />
      </VictoryChart>
    </div>
  );
}
