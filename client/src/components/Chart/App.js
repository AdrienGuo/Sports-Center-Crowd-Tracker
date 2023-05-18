import moment from "moment";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Legend,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import { fetchDBData, fetchPredictCenterCrowd } from "../../api";
import styles from "./Chart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = ({ data: { confirmed, recovered, deaths }, country }) => {
  const [centerCrowd, setCenterCrowd] = useState([]);
  const [predictCenterCrowd, setPredictCenterCrowd] = useState([]);

  useEffect(() => {
    const fetchDBAPI = async () => {
      const initialDBData = await fetchDBData();
      setCenterCrowd(initialDBData);
    };
    fetchDBAPI();
  }, []);

  useEffect(() => {
    const fetchPredictCenterCrowdAPI = async () => {
      const data = await fetchPredictCenterCrowd(centerCrowd);
      setPredictCenterCrowd(data);
    };
    fetchPredictCenterCrowdAPI();
  }, [centerCrowd]);

  let combinedCenterCrowd = [...centerCrowd, ...predictCenterCrowd];

  const barChart = confirmed ? (
    <Bar
      data={{
        labels: ["Infected", "Recovered", "Deaths"],
        datasets: [
          {
            label: "People",
            backgroundColor: [
              "rgba(0, 0, 255, 0.5)",
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
            ],
            data: [confirmed.value, recovered.value, deaths.value],
          },
        ],
      }}
      options={{
        legend: { display: false },
        title: { display: true, text: `Current state in ${country}` },
      }}
    />
  ) : null;

  console.log(centerCrowd);
  console.log(predictCenterCrowd);
  console.log(combinedCenterCrowd);

  const dash = (ctx, value) => (ctx.p0DataIndex >= 20 - 1 ? value : undefined);

  const lineChart = combinedCenterCrowd[0] ? (
    <Line
      data={{
        labels: combinedCenterCrowd.map(({ time }) =>
          moment(time).format("kk:mm")
        ),
        datasets: [
          {
            label: "健身房",
            data: combinedCenterCrowd.map((data) => data.gym),
            borderColor: "red",
            segment: {
              borderDash: (ctx) => dash(ctx, [5, 6]),
            },
            spanGaps: true,
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: false,
            tension: 0.1,
          },
          {
            label: "游泳池",
            data: combinedCenterCrowd.map((data) => data.swim),
            borderColor: "#3333ff",
            segment: {
              borderDash: (ctx) => dash(ctx, [5, 6]),
            },
            fill: false,
            tension: 0.1,
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "今日人數",
            font: {
              size: 30,
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 120,
          },
        },
      }}
    />
  ) : null;

  return <div className={styles.container}>{lineChart}</div>;
};

export default App;
