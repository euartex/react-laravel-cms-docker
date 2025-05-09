import React, { useEffect, useState, useRef } from "react";
import { func, string, number } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import axiosInstance from "config/axiosInstance";
import MESSAGES from "constants/notificationMessages";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "components/Table/Table.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";

import { tableRevisionHeaderCells, formatDate } from "./helper.js";

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
    justifyContent: "flex-end"
  }
};

const useStyles = makeStyles(styles);

const RevisionTable = ({ onClose, requestType, itemId, title }) => {
  const classes = useStyles();

  const [historyRows, setHistoryRows] = useState([]);
  const [appPagination, setAppPagination] = useState([]);
  const [appPage, setAppPage] = useState(0);
  const [appLimit, setAppLimit] = useState(20);
  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("This is fine");

  const notificationRef = useRef(null);

  const getTableRows = data => {
    const res = data.map(record => {
      if (record.meta?.length) {
        return record.meta.map(changedProp => {
          let newValue, oldValue;
          if (changedProp.key === "cover" || changedProp.key === "poster") {
            newValue = changedProp.new ? (
              <a
                href={changedProp.new}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img style={{ maxWidth: "150px" }} src={changedProp.new} />
              </a>
            ) : null;
            oldValue = changedProp.old ? (
              <a
                href={changedProp.old}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img style={{ maxWidth: "150px" }} src={changedProp.old} />
              </a>
            ) : null;
          } else {
            newValue =
              changedProp.new !== null
                ? String(changedProp.new)
                : changedProp.new;
            oldValue =
              changedProp.old !== null
                ? String(changedProp.old)
                : changedProp.old;
          }

          return [
            formatDate(record.performed_at),
            `${record.cms_user?.first_name || ""} ${record.cms_user
              ?.last_name || ""}`,
            changedProp.key,
            newValue || "—",
            oldValue || "—"
          ];
        });
      }
      return [];
    });
    return res.flat();
  };

  useEffect(() => {
    axiosInstance
      .get(
        `/revisions/${itemId}?model_type=${requestType}&limit=${appLimit}&page=${appPage}`
      )
      .then(res => {
        setAppPagination({
          total: res?.data?.pagination?.total,
          limit: res?.data?.pagination?.limit
        });
        setHistoryRows(getTableRows(res?.data?.data || []));
      })
      .catch(error => {
        setStatus("danger");
        setMessage(
          error?.response?.data?.message || MESSAGES.couldntReadFromError
        );
        return notificationRef?.current?.showNotification();
      });
  }, [appPage, appLimit]);

  return (
    <>
      <GridContainer justify="center" alignContent="center">
        <GridItem xs={12} sm={12} md={10} lg={6}>
          <Card>
            <CardHeader color="info">
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
              <Table
                tableData={historyRows}
                rowsPerPage={appLimit}
                page={appPage}
                count={appPagination?.total}
                onPageChange={newPage => setAppPage(newPage)}
                onChangeRowsPerPage={newRowsPerPage =>
                  setAppLimit(newRowsPerPage)
                }
                isSearch={false}
                isAddItem={false}
                tableHead={tableRevisionHeaderCells.map(
                  headerCell => headerCell.label
                )}
                isResponsive={true}
              />
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button type="button" onClick={onClose}>
                Close
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      {message && (
        <PopupNotification
          ref={notificationRef}
          status={status}
          message={message}
        />
      )}
    </>
  );
};

RevisionTable.propTypes = {
  requestType: string,
  onClose: func,
  title: string,
  itemId: number
};

export default RevisionTable;
