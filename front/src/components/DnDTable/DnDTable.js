import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import { CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Button from "components/CustomButtons/Button.js";
import ClearIcon from "@material-ui/icons/Clear";
import Pagination from "@material-ui/lab/Pagination";

// core components
import CustomInput from "../CustomInput/CustomInput.js";
import axiosInstance from "config/axiosInstance";
import commonStyles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { primaryColor } from "assets/jss/material-dashboard-react.js";
import { withStyles } from "@material-ui/core/styles";

/**
 * Theme for table pagination
 */
const PaginationTheme = withStyles({
  actions: {
    display: "none"
  },
  toolbar: {
    paddingLeft: "0"
  },
  root: {
    float: "left"
  }
})(TablePagination);

const compStyles = {
  tableFooter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "25px 0px 15px 0"
  },
  searchSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  searchSectionBottom: {
    marginBottom: "10px"
  },
  searchInputContainer: {
    marginTop: "0",
    paddingBottom: 0
  },
  singleChild: {
    margin: "0 0 0 auto"
  },
  tableFooterDeleteButton: {
    justifyContent: "space-between"
  },
  rowStyle: {
    background: "white",
    boxSizing: "content-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px black solid"
  },
  withoutBorder: {
    border: "none"
  },
  spinner: {
    color: primaryColor[0]
  },
  scrollable: {
    maxHeight: "700px"
  },
  secondaryComponents: {
    display: "flex",
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  spaceBetween: {
    justifyContent: "space-between"
  },
  additionalSpace: {
    marginRight: "20px"
  }
};

const useStyles = makeStyles(commonStyles);
const useAdditionalStyles = makeStyles(compStyles);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const CustomTable = props => {
  const classes = useStyles();

  const additionalClasses = useAdditionalStyles();
  const {
    rowsPerPageOptions = [20, 100, 250],
    orderUrl,
    tableHead,
    tableData,
    tableHeaderColor,
    onAddClick,
    page = 0,
    count = 0,
    isScrollable,
    onPageChange,
    onChangeRowsPerPage,
    rowsPerPage = 0,
    onSearch,
    addButtonText = "Add",
    showPagination = true,
    isSearch = true,
    isAddItem = true,
    searchString,
    tableHeadCellClasses,
    tableRowCellClasses,
    getPage,
    tableHeaderCells,
    isResponsive = false,
    deleteRowsComponent,
    deleteRows,
    isLoading,
    draggableKeyName = "id",
    secondaryControlComponents,
    DnDrowStyle,
    onClear
  } = props;
  const [innerTableData, setInnerTableData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setInnerTableData(tableData);
  }, [tableData]);

  const handleDragEnd = ({ destination, source, draggableId }) => {
    if (!destination || !source || !draggableId) return;
    setInnerTableData(reorder(innerTableData, source.index, destination.index));

    const type = destination.index > source.index ? "moveAfter" : "moveBefore";
    const positionEntityId = tableData[destination.index].id;
    axiosInstance
      .post(orderUrl, {
        [draggableKeyName]: draggableId,
        type,
        positionEntityId
      })
      .then(() => {
        getPage();
      });
  };

  const handleChangePage = (event, newPage) => {
    if (typeof onPageChange === "function") {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event, newRowsPerPage) => {
    if (typeof onChangeRowsPerPage === "function") {
      onChangeRowsPerPage(newRowsPerPage.key);
    }
  };

  const tableStyle = classNames({
    [classes.table]: !!classes.table,
    ...(isResponsive
      ? {
          [classes.tableResponsive]: true
        }
      : {})
  });

  const footerStyle = classNames({
    [additionalClasses.tableFooter]: true,
    ...(deleteRows
      ? {
          [additionalClasses.tableFooterDeleteButton]: true
        }
      : {})
  });

  const headStyles = classNames({
    [additionalClasses.searchSection]: true,
    [additionalClasses.searchSectionBottom]:
      isAddItem || isSearch || secondaryControlComponents
  });

  const secondaryComponentsStyle = classNames({
    [additionalClasses.secondaryComponents]: true,
    [additionalClasses.spaceBetween]: !isAddItem
  });

  const searchStyle = classNames({
    [additionalClasses.searchInputContainer]: true,
    [additionalClasses.singleChild]: !isAddItem && !secondaryControlComponents,
    [additionalClasses.additionalSpace]: !!secondaryControlComponents
  });

  return (
    <div
      className={`${classes.tableResponsive} ${
        isScrollable ? additionalClasses.scrollable : ""
      }`}
    >
      <div className={headStyles}>
        {isAddItem && (
          <Button color="primary" onClick={onAddClick}>
            {addButtonText}
          </Button>
        )}
        <div className={secondaryComponentsStyle}>
          {isSearch && (
            <CustomInput
              labelText="Search"
              id="search"
              formControlProps={{
                fullWidth: false,
                className: searchStyle
              }}
              value={searchString}
              onChange={onSearch}
              inputProps={{
                type: "text",
                name: "search",
                required: true,
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      if (inputRef?.current?.value) {
                        inputRef.current.value = "";
                      }
                      onClear();
                    }}
                    style={{ padding: "4px" }}
                  >
                    <ClearIcon />
                  </IconButton>
                )
              }}
              inputRef={inputRef}
            />
          )}
          {secondaryControlComponents !== undefined &&
            secondaryControlComponents}
        </div>
      </div>

      {showPagination && innerTableData.length ? (
        <PaginationTheme
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : null}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`1`}>
          {(provided, snapshot) => (
            <Table
              className={tableStyle}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tableHead !== undefined ? (
                <TableHead
                  className={classes[tableHeaderColor + "TableHeader"]}
                >
                  <TableRow className={classes.tableHeadRow}>
                    {tableHead.map((prop, key) => {
                      const tableCellStyle = classNames({
                        [classes.tableCell]: true,
                        [classes.tableHeadCell]: true,
                        ...(tableHeadCellClasses
                          ? {
                              [tableHeadCellClasses[key]]:
                                tableHeadCellClasses[key] !== undefined
                            }
                          : {})
                      });

                      return (
                        <TableCell className={tableCellStyle} key={key}>
                          {prop}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
              ) : null}

              <TableBody>
                {!tableData.length && !isLoading ? (
                  <TableRow className={classes.tableBodyRow}>
                    <TableCell
                      align="center"
                      className={classes.tableCell}
                      colSpan={
                        tableHead?.length || tableHeaderCells?.length || 1
                      }
                    >
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  innerTableData.map(({ id, data, status }, key) => {
                    //assets with status draft should be gray
                    const isDraft = status === "draft";
                    return (
                      <Draggable key={id} draggableId={`${id}`} index={key}>
                        {(provided, snapshot) => {
                          const { style } = provided.draggableProps;
                          // if (snapshot.isDragging) {

                          // }
                          return (
                            <TableRow
                              classes={
                                snapshot.isDragging
                                  ? {
                                      root:
                                        DnDrowStyle ||
                                        additionalClasses.rowStyle
                                    }
                                  : {}
                              }
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...style,
                                ...(isDraft && { backgroundColor: "lightgray" })
                              }}
                            >
                              {data.map((prop, key) => {
                                const tableRowCellStyle = classNames({
                                  [classes.tableCell]: true,
                                  ...(tableRowCellClasses
                                    ? {
                                        [tableRowCellClasses[key]]:
                                          tableHeadCellClasses[key] !==
                                          undefined
                                      }
                                    : {}),
                                  [additionalClasses.withoutBorder]:
                                    snapshot.isDragging
                                });
                                return (
                                  <TableCell
                                    className={tableRowCellStyle}
                                    key={key}
                                  >
                                    {prop}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        }}
                      </Draggable>
                    );
                  })
                )}
                {provided.placeholder}
                {isLoading && (
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={
                        tableHead?.length || tableHeaderCells?.length || 1
                      }
                    >
                      <CircularProgress
                        color="primary"
                        className={additionalClasses.spinner}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
      <div className={footerStyle}>
        {deleteRows !== undefined && deleteRowsComponent}
        {showPagination && innerTableData.length ? (
          <Pagination
            defaultPage={1}
            count={Math.ceil(count / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
          />
        ) : null}
      </div>
    </div>
  );
};

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object),
  onAddClick: PropTypes.func,
  page: PropTypes.number,
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  rowsPerPage: PropTypes.number,
  onSearch: PropTypes.func,
  addButtonText: PropTypes.string,
  showPagination: PropTypes.bool,
  isSearch: PropTypes.bool,
  isAddItem: PropTypes.bool,
  searchString: PropTypes.string,
  tableHeadCellClasses: PropTypes.arrayOf(PropTypes.string),
  tableRowCellClasses: PropTypes.arrayOf(PropTypes.string),
  isSortable: PropTypes.bool,
  tableHeaderCells: PropTypes.array,
  onSortClick: PropTypes.func,
  defaultSorting: PropTypes.string,
  defaultSortingOrder: PropTypes.string,
  isResponsive: PropTypes.bool,
  selectProjectComponent: PropTypes.node,
  selectCompanyComponent: PropTypes.node,
  isSelectable: PropTypes.bool,
  TableBodyComponent: PropTypes.node,
  deleteRowsComponent: PropTypes.node,
  deleteRows: PropTypes.bool,
  orderUrl: PropTypes.string,
  draggableKeyName: PropTypes.string,
  secondaryControlComponents: PropTypes.any,
  isScrollable: PropTypes.bool,
  getPage: PropTypes.func,
  isLoading: PropTypes.bool,
  DnDrowStyle: PropTypes.string,
  onClear: PropTypes.func
};

export default CustomTable;
