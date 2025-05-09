import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import axiosInstance from "config/axiosInstance";

import commonStyles from "assets/jss/material-dashboard-react/components/typographyStyle.js";
import { primaryColor } from "assets/jss/material-dashboard-react.js";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh"
  },
  messageBody: {
    padding: "30px 0"
  },
  spinner: {
    color: primaryColor[0],
    padding: "20px 0"
  }
};

const useStyles = makeStyles({ ...styles, ...commonStyles });

const EmailVerification = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(location.search);
    const expires = Number(params.get("expires"));
    const today = new Date().getTime() / 1000;

    if (expires >= today) {
      axiosInstance
        .get(`/cms-users/verification${location.search}`)
        .then(() => {
          setMessage("You successfully confirmed the email, now please login");
          setLoading(false);
          setTimeout(() => {
            history.push("/login");
          }, 4000);
        })
        .catch(error => {
          setMessage(error?.response?.data?.message || "Something went wrong");
          setLoading(false);
        });
    } else {
      setMessage(
        "Unfortunately the verification link has expired, please contact the Administrator"
      );
      setLoading(false);
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <GridContainer
        justify="center"
        style={{ minHeight: "100vh" }}
        alignContent="center"
      >
        <GridItem xs={12} sm={8} md={6} lg={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Email verification</h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center" alignItems="center">
                <GridItem>
                  {isLoading ? (
                    <CircularProgress
                      color="primary"
                      className={classes.spinner}
                    />
                  ) : (
                    <div
                      className={
                        classes.defaultFontStyle + " " + classes.messageBody
                      }
                    >
                      {message}
                    </div>
                  )}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default EmailVerification;
