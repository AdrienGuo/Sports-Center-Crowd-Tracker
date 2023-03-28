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

import { fetchDBData } from "../../api";
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
  const [dailyData, setDailyData] = useState({});

  useEffect(() => {
    const fetchDBAPI = async () => {
      const initialDBData = await fetchDBData();
      setDailyData(initialDBData);
    };

    fetchDBAPI();
  }, []);

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

  console.log(dailyData);
  const lineChart = dailyData[0] ? (
    <Line
      data={{
        labels: dailyData.map(({ time }) => moment(time).format("kk:mm")),
        datasets: [
          {
            data: dailyData.map((data) => data.gym),
            label: "健身房",
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: false,
          },
          {
            data: dailyData.map((data) => data.swim),
            label: "游泳池",
            borderColor: "#3333ff",
            fill: false,
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
