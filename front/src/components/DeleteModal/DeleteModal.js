import React from "react";
import { func, object, bool } from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardFooter from "components/Card/CardFooter.js";

const styles = {
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
  }
};

const useStyles = makeStyles(styles);

const DeleteModal = ({ onClose, onConfirm, itemForDelete, open }) => {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={open}>
        <GridContainer justify="center" alignContent="center">
          <GridItem xs={12} sm={4} md={4} lg={3}>
            <Card>
              <CardHeader color="danger">
                <h4 className={classes.cardTitleWhite}>
                  Delete {itemForDelete.type}
                  <span
                    className={`material-icons ${classes.closeButton}`}
                    onClick={onClose}
                  >
                    clear
                  </span>
                </h4>
              </CardHeader>
              <CardBody>
                <p>
                  Are you sure you want to delete the{" "}
                  <b>{itemForDelete.name || ""}</b>?
                </p>
              </CardBody>
              <CardFooter className={classes.footer}>
                <Button type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" color="info" onClick={onConfirm}>
                  Confirm
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </Fade>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onClose: func,
  onConfirm: func,
  itemForDelete: object,
  open: bool
};

export default DeleteModal;
