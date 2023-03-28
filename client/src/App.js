import React from "react";

import { useState } from "react";
import { fetchData } from "./api";
import styles from "./App.module.css";
import { Cards, Chart } from "./components";
import image from "./images/center.png";

class App extends React.Component {
  state = {
    data: {},
    country: "",
    apiResponse: "abc",
    dbResponse: "db",
  };

  callAPI() {
    fetch("http://localhost:81/testAPI")
      .then((res) => res.text())
      .then((res) => {
        this.setState({ apiResponse: res });
        return res;
      })
      .then((res) => console.log(res))
      .catch((err) => err);
  }

  callDB() {
    fetch("http://localhost:81/testDB/get/gym")
      .then((res) => res.text())
      .then((res) => {
        this.setState({ dbResponse: res });
        return res;
      })
      .then((res) => console.log(res))
      .catch((err) => err);
  }

  async componentDidMount() {
    const data = await fetchData();
    this.setState({ data });
    this.callAPI();
    this.callDB();
  }

  handleCountryChange = async (country) => {
    const data = await fetchData(country);
    this.setState({ data, country: country });
  };

  render() {
    const { data, country, apiResponse, dbResponse } = this.state;

    return (
      <div className={styles.container}>
        <img className={styles.image} src={image} alt="COVID-19" />
        {/* <Cards data={data} /> */}
        {/* <CountryPicker handleCountryChange={this.handleCountryChange} /> */}
        <Chart data={data} country={country} />
      </div>
    );
  }
}

export default App;
