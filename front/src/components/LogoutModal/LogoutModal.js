import React from "react";
import { bool, func } from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
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
  modal: {
    overflow: "scroll"
  }
};

const useStyles = makeStyles(styles);

const LogoutModal = ({ open, onClose, onConfirm }) => {
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
        <GridContainer
          justify="center"
          style={{ minHeight: "100vh" }}
          alignContent="center"
        >
          <GridItem xs={12} sm={4} md={4} lg={3}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>
                  Logout{" "}
                  <span
                    className={`material-icons ${classes.closeButton}`}
                    onClick={onClose}
                  >
                    clear
                  </span>
                </h4>
              </CardHeader>
              <CardBody>
                <p>Are you sure you want to logout?</p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  className={classes.cancel}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="button" color="danger" onClick={onConfirm}>
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </Fade>
    </Modal>
  );
};

LogoutModal.propTypes = {
  open: bool,
  onClose: func,
  onConfirm: func
};

export default LogoutModal;
