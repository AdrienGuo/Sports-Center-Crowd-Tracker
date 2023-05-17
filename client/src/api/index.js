import axios from "axios";

const url = "https://covid19.mathdro.id/api";

export const fetchData = async (country) => {
  let changeableUrl = url;

  if (country) {
    changeableUrl = `${url}/countries/${country}`;
  }

  try {
    const {
      data: { confirmed, recovered, deaths, lastUpdate },
    } = await axios.get(changeableUrl);

    return { confirmed, recovered, deaths, lastUpdate };
  } catch (error) {
    return error;
  }
};

// export const fetchDailyData = async () => {
//   try {
//     const { data } = await axios.get(`${url}/daily`);

//     return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
//   } catch (error) {
//     return error;
//   }
// };

// Instead of Global, it fetches the daily data for the US
export const fetchDailyData = async () => {
  try {
    const { data } = await axios.get(
      "https://api.covidtracking.com/v1/us/daily.json"
    );

    return data
      .reverse()
      .map(({ positive, recovered, death, dateChecked: date }) => ({
        confirmed: positive,
        recovered,
        deaths: death,
        date,
      }));
  } catch (error) {
    return error;
  }
};

export const fetchCountries = async () => {
  try {
    const {
      data: { countries },
    } = await axios.get(`${url}/countries`);

    return countries.map((country) => country.name);
  } catch (error) {
    return error;
  }
};

export const fetchDBData = async () => {
  try {
    const { data } = await axios.get("http://localhost:81/database/get/gym");
    return data.slice(-20).map(({ time, gym, swim }) => ({
      time,
      gym,
      swim,
    }));
  } catch (error) {
    return error;
  }
};

export const fetchPredictCenterCrowd = async (centerCrowd) => {
  console.log(centerCrowd);
  try {
    let { data } = await axios.post(
      "http://localhost:8000/predict",
      centerCrowd,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
};

// export const fetchPredictCenterCrowd = async (centerCrowd) => {
//   try {
//     let { data } = await axios.get("http://localhost:8000/predictOld");
//     return data;
//   } catch (error) {
//     return error;
//   }
// };

// export const fetchPredictCenterCrowd = async (centerCrowd) => {
//   try {
//     let { data } = await axios.get("http://localhost:8000");
//     return data;
//   } catch (error) {
//     return error;
//   }
// };
