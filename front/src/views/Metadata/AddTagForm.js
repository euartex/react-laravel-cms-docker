import React, { useState } from "react";
import { object, func, bool, array } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomMultiSelect from "components/CustomMultiSelect/CustomMultiSelect";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

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
  flexSpaceBetween: {
    display: "flex",
    justifyContent: "space-between"
  },
  checkbox: {
    marginTop: "27px",
    display: "flex",
    position: "relative",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "dotted 1px gray"
  },
  centered: {
    width: "100%",
    textAlign: "center"
  },
  changeIsTopModalContent: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 4px 5px 1px rgba(0,0,0,0.75)",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    fontSize: "20px",
    zIndex: 10000
  },
  changeIsTopModal: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

const useStyles = makeStyles({ ...styles, ...customStyles });

const AddTagForm = ({
  isEditMode,
  onClose,
  handleChange,
  dataForm,
  submitForm,
  categories,
  topTag
}) => {
  const classes = useStyles();
  const {
    title,
    metadata_ids,
    is_asset_pl_add_sort_by_id,
    is_top_news_tag,
    id
  } = dataForm;
  const [isDisabledCheckboxHovered, setHoverDisabledCheckbox] = useState(false);
  const [isConfirmEditTopTagOpened, setConfirmTopTagEdit] = useState(false);

  const isCurrentTopTag = is_top_news_tag && id === topTag?.id;
  useSubmitOnEnter(submitForm);
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {`${isEditMode ? "Update" : "Add"} tag`}
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
                    labelText="Tag name"
                    id="title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={title || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "title",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomMultiSelect
                    labelText="Category"
                    id="metadata-categories"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={metadata_ids}
                    onChange={handleChange}
                    options={categories.map(category => ({
                      value: category.id,
                      label: category.name
                    }))}
                    chipColor="info"
                    inputProps={{
                      name: "metadata_ids"
                    }}
                    isAutoComplete={true}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <div className={classes.checkbox}>
                    <span>
                      Sort by descending order the assets assigned to a playlist
                      via this tag?
                    </span>
                    <Checkbox
                      id="is_asset_pl_add_sort_by_id"
                      name="is_asset_pl_add_sort_by_id"
                      checked={is_asset_pl_add_sort_by_id}
                      onChange={handleChange}
                      tabIndex={-1}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: is_asset_pl_add_sort_by_id && classes.checked,
                        root: classes.root
                      }}
                    />
                  </div>
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <div
                    className={classes.checkbox}
                    onMouseEnter={() => {
                      isCurrentTopTag && setHoverDisabledCheckbox(true);
                    }}
                    onMouseLeave={() => setHoverDisabledCheckbox(false)}
                  >
                    {isConfirmEditTopTagOpened && !!topTag && (
                      <div
                        className={classes.changeIsTopModal}
                        onClick={() => setConfirmTopTagEdit(false)}
                      >
                        <div
                          className={classes.changeIsTopModalContent}
                          onClick={e => e.stopPropagation()}
                        >
                          <p className={classes.centered}>
                            Are you sure you want to change the top news tag
                            from &quot;{topTag?.title}&quot; to &quot;{title}
                            &quot;?
                          </p>
                          <Button onClick={() => setConfirmTopTagEdit(false)}>
                            No
                          </Button>
                          <Button
                            color="info"
                            onClick={() => {
                              submitForm();
                              setConfirmTopTagEdit(false);
                            }}
                          >
                            Yes
                          </Button>
                        </div>
                      </div>
                    )}
                    {!isDisabledCheckboxHovered && (
                      <span>Is top news tag?</span>
                    )}
                    {isDisabledCheckboxHovered && isCurrentTopTag && (
                      <div>
                        You must have a Top News Tag. If you want to change it -
                        please edit the tag you want to be the new Top News Tag
                      </div>
                    )}
                    <Checkbox
                      id="is_top_news_tag"
                      name="is_top_news_tag"
                      checked={is_top_news_tag}
                      disabled={is_top_news_tag && isCurrentTopTag}
                      onChange={handleChange}
                      tabIndex={-1}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked:
                          !(is_top_news_tag && isCurrentTopTag) &&
                          classes.checked,
                        root: classes.root
                      }}
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.flexSpaceBetween}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="info"
                type="submit"
                onClick={() => {
                  is_top_news_tag && !isCurrentTopTag && !!topTag
                    ? setConfirmTopTagEdit(true)
                    : submitForm();
                }}
                xs={12}
                sm={12}
                md={12}
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

AddTagForm.propTypes = {
  location: object,
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  resetPassword: func,
  isEditMode: bool,
  categories: array,
  topTag: object
};

export default AddTagForm;
