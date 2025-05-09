import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Muted from "components/Typography/Muted.js";
import IconNotFound from "assets/img/not-found-icon.png";

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
    height: "calc(100vh - 126px)"
  }
};

const useStyles = makeStyles(styles);

const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={8} md={6} lg={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>404</h4>
            </CardHeader>
            {/* special fix to make left side space same as header and footer */}
            <CardBody style={{ paddingLeft: "15px" }}>
              <GridContainer alignItems="center">
                <GridItem xs={3} sm={4}>
                  <img alt="404" src={IconNotFound} />
                </GridItem>
                <GridItem xs={9} sm={8}>
                  <p>The page you are looking for can not be found!</p>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Muted>
                <Link href="/dashboard" variant="body2">
                  Go to the Home page
                </Link>
              </Muted>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default NotFound;
