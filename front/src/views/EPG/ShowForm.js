import React, {useRef, useState} from "react";
import { object, func, bool } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import PlaylistSelect from "components/PlaylistSelect/PlaylistSelect.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import CustomInputFile from "components/CustomInputFile/CustomInputFile";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import {Checkbox, Typography} from "@material-ui/core";
import Muted from "components/Typography/Muted";
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
  labelLeft: {
    flexGrow: "0",
    maxWidth: "50%",
    flexBasis: "50%"
  },
  textRight: {
    textAlign: "right"
  },
  currentImageContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    boxSizing: "border-box",
    padding: "0px 15px",
    margin: "0 !important",
    width: "100% !important"
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
const ShowForm = ({ onClose, handleChange, dataForm, submitForm, isEdit, onFileChange }) => {
const classes = useStyles();
const {title, description, poster, cover, playlist_id} = dataForm;
const initialCover = useRef(cover);
const initialPoster = useRef(poster);

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {isEdit ? "Edit" : "Add"} show
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
                    labelText="Title *"
                    id="title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={title}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "title",
                      required: true
                    }}
                  />
                </GridItem>

                {/* text area */}
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Description *"
                    id="new-description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={description}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "description",
                      required: true,
                      multiline: true,
                      rows: 5
                    }}
                  />
                  <CustomInputFile
                      formControlProps={{
                        fullWidth: true
                      }}
                      labelText="Poster image"
                      name="poster"
                      onChange={e => {
                        if (e && e.persist) {
                          e.persist();
                        }
                        onFileChange({
                          name: "poster",
                          target: e.target
                        });
                      }}
                      id="poster"
                  />
                  <div>
                    <p>Current poster thumbnail</p>
                  </div>
                  <div>
                    {!initialPoster?.current ? (
                        <Muted className={classes.textRight}>
                          Currently no image in use
                        </Muted>
                    ) : initialPoster?.current?.small ? (
                        <img
                            src={initialPoster.current.small}
                            alt="Current poster"
                            style={{ width: "100%" }}
                        />
                    ) : (
                        <Muted className={classes.textRight}>
                          Please wait, the image is processing on server
                        </Muted>
                    )}
                  </div>
                  <CustomInputFile
                      formControlProps={{
                        fullWidth: true
                      }}
                      labelText="Cover image"
                      name="cover"
                      onChange={e => {
                        if (e && e.persist) {
                          e.persist();
                        }
                        onFileChange({
                          name: "cover",
                          target: e.target
                        });
                      }}
                      id="cover"
                  />
                  <div>
                    <p>Current cover thumbnail</p>
                  </div>
                  <div>
                    {!initialCover?.current ? (
                        <Muted className={classes.textRight}>
                          Currently no image in use
                        </Muted>
                    ) : initialCover?.current?.small ? (
                        <img
                            src={initialCover.current.small}
                            alt="Current cover"
                            style={{ width: "100%" }}
                        />
                    ) : (
                        <Muted className={classes.textRight}>
                          Please wait, the image is processing on server
                        </Muted>
                    )}
                  </div>
                  <div>
                    <PlaylistSelect
                      labelText="Select playlist"
                      id="playlist_id"
                      formControlProps={{
                        fullWidth: true
                      }}
                      value={playlist_id}
                      onChange={handleChange}
                      inputProps={{
                        type: "text",
                        name: "playlist_id"
                      }}/>
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="info"
                type="submit"
                onClick={submitForm}
                xs={12}
                sm={12}
                md={12}
                disabled={!title?.length || !description?.length}
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

ShowForm.propTypes = {
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  isEdit: bool,
  onFileChange: func,
};

export default ShowForm;
