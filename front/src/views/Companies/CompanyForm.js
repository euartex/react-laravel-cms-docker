import React, { useState, useEffect } from "react";
import { func, string, object, arrayOf, bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import CustomSelect from "components/CustomSelect/CustomSelect.js";
import CustomMultiSelect from "components/CustomMultiSelect/CustomMultiSelect";

import checkBoxStyles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import { grayColor } from "assets/jss/material-dashboard-react.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";
import { convertDataToOptions } from "helpers/convertDataToOptions";
import axiosInstance from "config/axiosInstance";

const compStyles = {
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
  deleteImageButton: {
    cursor: "pointer",
    color: grayColor[3]
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
    borderBottom: `1px solid ${grayColor[4]}`
  }
};
const styles = { ...checkBoxStyles, ...compStyles, ...customInputStyle };

const useStyles = makeStyles(styles);

const CompanyForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  countries,
  loading,
  handleMultiSelectChange,
  isEditMode
}) => {
  const classes = useStyles();
  const {
    newCompanyName,
    newCompanyAddress,
    newCompanyZip,
    newCompanyCountry,
    newCompanyPhone,
    newCompanyEmail,
    isAutoPublish,
    newCompanyTags,
    is_auto_assign_top_news_tag
  } = dataForm;

  const selectedCountry =
    countries.find(country => country === newCompanyCountry) || "";
  const [metaData, setMetaData] = useState([]);

  useEffect(() => {
    axiosInstance.get("/tags?limit=1000&without_relations=true").then(res => {
      setMetaData(convertDataToOptions(res?.data?.data));
    });
  }, []);

  useSubmitOnEnter(submitForm);
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {isEditMode ? "Update company" : "Add company"}
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
                    labelText="Company name *"
                    id="new-company-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newCompanyName}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "newCompanyName",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Address"
                    id="new-address"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newCompanyAddress}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "newCompanyAddress",
                      required: true,
                      multiline: true,
                      rows: 2
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Zip"
                    id="new-zip"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newCompanyZip}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "newCompanyZip"
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomSelect
                    labelText="Country"
                    id="new-company-country"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={{ value: selectedCountry, label: selectedCountry }}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "newCompanyCountry",
                      required: true
                    }}
                    options={countries.map(country => ({
                      value: country,
                      label: country
                    }))}
                    isAutoComplete={true}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Phone"
                    id="new-company-phone"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newCompanyPhone}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "newCompanyPhone",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Email *"
                    id="new-company-email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newCompanyEmail}
                    onChange={handleChange}
                    inputProps={{
                      type: "email",
                      name: "newCompanyEmail",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomMultiSelect
                    labelText="Metadata - Tags"
                    id="meta-tags"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newCompanyTags}
                    onChange={handleMultiSelectChange}
                    options={metaData}
                    chipColor="info"
                    inputProps={{
                      name: "metaTags"
                    }}
                    isAutoComplete={true}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className={classes.checkbox}>
                    <span className={classes.labelRoot}>Auto Publish?</span>
                    <Checkbox
                      id="isAutoPublish"
                      name="isAutoPublish"
                      checked={isAutoPublish}
                      onChange={handleChange}
                      tabIndex={-1}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked,
                        root: classes.root
                      }}
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className={classes.checkbox}>
                    <span className={classes.labelRoot}>
                      Auto assign top news tag
                    </span>
                    <Checkbox
                      id="is_auto_assign_top_news_tag"
                      name="is_auto_assign_top_news_tag"
                      checked={is_auto_assign_top_news_tag}
                      onChange={handleChange}
                      tabIndex={-1}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked,
                        root: classes.root
                      }}
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={submitForm}
                color="info"
                disabled={!newCompanyName.length || !newCompanyEmail || loading}
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

CompanyForm.propTypes = {
  onClose: func,
  handleChange: func,
  dataForm: object,
  submitForm: func,
  countries: arrayOf(string),
  loading: bool,
  handleMultiSelectChange: func,
  isEditMode: bool
};

export default CompanyForm;
