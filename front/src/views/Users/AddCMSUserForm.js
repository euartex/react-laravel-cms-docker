import React from "react";

import { object, func, bool, array } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomSelect from "components/CustomSelect/CustomSelect.js";
import Button from "components/CustomButtons/Button.js";
import CustomMultiSelect from "components/CustomMultiSelect/CustomMultiSelect.js";
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
  flexCenter: {
    display: "flex",
    justifyContent: "center"
  },
  flexSpaceBetween: {
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
  resetPassword,
  companyOptions,
  roles,
  isLoading
}) => {
  const classes = useStyles();
  const {
    email,
    last_name,
    first_name,
    role_id,
    phone,
    company_ids,
    password
  } = dataForm;

  // const foundedCompany = companies.find(
  //   company => company.id === company_id
  // ) || { id: "", name: "" };

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
                    labelText="Email address *"
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
                    labelText="Password *"
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
                    labelText="Confirm password *"
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
                  <CustomInput
                    labelText="Phone"
                    id="phone"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={phone}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "phone"
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomMultiSelect
                    labelText="Companies"
                    id="company_ids"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={company_ids}
                    onChange={handleChange}
                    options={companyOptions}
                    chipColor="info"
                    inputProps={{
                      name: "company_ids"
                    }}
                    isAutoComplete={true}
                  />
                </GridItem>
                {(role_id != '' && role_id != null && roles.filter(role => role.id == role_id).length === 0  ? true : false) === false && (
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomSelect
                      labelText="Role *"
                      id="role"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={handleChange}
                      inputProps={{
                        name: "role_id",
                        required: true
                      }}
                      options={roles.map(role => ({
                        value: role.id,
                        label: role.name
                      }))}
                      value={role_id}
                    ></CustomSelect>
                  </GridItem>
                )}
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.flexSpaceBetween}>
              {isEditMode && (
                <Button color="warning" onClick={() => resetPassword(email)}>
                  Reset password
                </Button>
              )}
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="info"
                type="submit"
                onClick={submitForm}
                xs={12}
                sm={12}
                md={12}
                disabled={isLoading || !email.length}
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
  resetPassword: func,
  isEditMode: bool,
  companies: array,
  roles: array,
  isLoading: bool,
  companyOptions: array
};

export default AddUserForm;
