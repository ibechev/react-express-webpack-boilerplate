import React from "react";
import PropTypes from "prop-types";
import Logo from "../../assets/images/React-logo.png";
import style from "./Home.scss";

const Home = ({ message }) => {
  return (
    <div className={style.Home}>
      <img src={Logo} alt="React logo" />
      <h1>{message}</h1>
      <ul>
        <li>Express</li>
        <li>React</li>
        <li>Webpack</li>
        <li>HMR</li>
        <li>SCSS</li>
        <li>Jest</li>
        <li>Enzyme</li>
        <li>ESLint</li>
      </ul>
    </div>
  );
};

Home.propTypes = {
  message: PropTypes.string
};

export default Home;
