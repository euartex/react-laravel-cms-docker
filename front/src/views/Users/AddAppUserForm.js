import React from "react";

import { object, func, bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";

const customStyles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    display: "flex",
    justifyContent: "space-between"
  },
  closeButton: {
    cursor: "pointer"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between"
  },
  checkbox: {
    marginTop: "27px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "dotted 1px gray"
  }
};

const useStyles = makeStyles({ ...styles, ...customStyles });

const AddUserForm = ({
  isEditMode,
  onClose,
  handleChange,
  dataForm,
  submitForm,
  isLoading
}) => {
  const classes = useStyles();
  const { email, last_name, first_name, newsletter } = dataForm;

  useSubmitOnEnter(submitForm);

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {isEditMode ? 'Edit' : 'Add'} user
                <span
                  className={`material-icons ${classes.closeButton}`}
                  onClick={onClose}
                >
                  clear
                </span>
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={email || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "email",
                      name: "email",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    // value={password}
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
                    labelText="Confirm password"
                    id="confirm-password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    // value={password}
                    onChange={handleChange}
                    inputProps={{
                      type: "password",
                      name: "confirmPassword",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="First name"
                    id="first-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={first_name || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "first_name",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Last name"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={last_name || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "last_name",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className={classes.checkbox}>
                    Newsletter
                    <Checkbox
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked,
                        root: `${classes.root} ${classes.checkboxContainer}`
                      }}
                      onChange={handleChange}
                      name="newsletter"
                      id="newslettern"
                      checked={!!newsletter}
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button color="danger" onClick={onClose}>
                {" "}
                Cancel
              </Button>
              <Button
                color="info"
                type="submit"
                onClick={submitForm}
                xs={12}
                sm={12}
                md={12}
                disabled={isLoading}
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

AddUserForm.propTypes = {
  location: object,
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  isLoading: bool
};

export default AddUserForm;
