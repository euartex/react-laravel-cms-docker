import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import welcomeImage from "assets/img/welcome.png";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh"
  },
  text: {
    fontSize: "40px",
    fontWeight: "400",
    lineHeight: "140%"
  }
};
const useStyles = makeStyles(styles);

const WelcomePage = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <img src={welcomeImage} />
      <p className={classes.text}>Welcome to America&apos;s Voice</p>
    </div>
  );
};

export default WelcomePage;
