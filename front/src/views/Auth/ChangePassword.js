import React, { useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";

import axiosInstance from "config/axiosInstance";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";

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
  }
};

const useStyles = makeStyles(styles);

const ChangePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [new_password_confirmation, setConfirmationPassword] = useState("");

  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("This is fine");
  const [isLoading, setIsLoading] = useState(false);

  const notificationRef = useRef(null);

  const classes = useStyles();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "new_password") {
      setNewPassword(value);
    } else {
      setConfirmationPassword(value);
    }
  };

  return (
    <div className={classes.wrapper}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={8} md={6} lg={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Change password</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Old password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={password}
                    onChange={handleChange}
                    inputProps={{
                      type: "password",
                      name: "password",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="New password"
                    id="new-password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={new_password}
                    onChange={handleChange}
                    inputProps={{
                      type: "password",
                      name: "new_password",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="New password confirmation"
                    id="confirm-password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={new_password_confirmation}
                    onChange={handleChange}
                    inputProps={{
                      type: "password",
                      name: "new_password_confirmation",
                      required: true
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button
                type="submit"
                onClick={() => {
                  setIsLoading(true);
                  axiosInstance
                    .post("/cms-users/me/update", {
                      _method: "PUT",
                      password: password,
                      new_password: new_password
                    })
                    .then(() => {
                      setMessage("The password was changed");
                      setStatus("success");
                      setPassword("");
                      setNewPassword("");
                      setConfirmationPassword("");
                      return notificationRef?.current?.showNotification();
                    })
                    .catch(error => {
                      setStatus("danger");
                      setMessage(
                        error?.response?.data?.message || "Something went wrong"
                      );
                      return notificationRef?.current?.showNotification();
                    })
                    .finally(() => setIsLoading(false));
                }}
                color="primary"
                disabled={
                  !password ||
                  !new_password ||
                  !new_password_confirmation ||
                  isLoading ||
                  new_password !== new_password_confirmation
                }
              >
                Reset password
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <PopupNotification
        ref={notificationRef}
        status={status}
        message={message}
      />
    </div>
  );
};

export default ChangePasswordPage;
