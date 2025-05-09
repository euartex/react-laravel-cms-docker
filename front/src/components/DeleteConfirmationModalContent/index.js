import React from "react";
import { string, any, func, bool } from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

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

const DeleteConfirmationModalContent = ({
  title,
  children,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const classes = useStyles();

  return (
    <GridContainer justify="center" alignContent="center">
      <GridItem xs={12} sm={4} md={4} lg={3}>
        <Card>
          <CardHeader color="danger">
            <h4 className={classes.cardTitleWhite}>
              {title}
              <span
                className={`material-icons ${classes.closeButton}`}
                onClick={onClose}
              >
                clear
              </span>
            </h4>
          </CardHeader>
          <CardBody>
            <p>{children}</p>
          </CardBody>
          <CardFooter className={classes.footer}>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              color="info"
              onClick={onConfirm}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

DeleteConfirmationModalContent.propTypes = {
  title: string,
  children: any,
  onClose: func,
  onConfirm: func,
  isLoading: bool
};

export default DeleteConfirmationModalContent;
