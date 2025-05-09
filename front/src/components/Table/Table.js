import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import debounce from "lodash.debounce";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import Pagination from '@material-ui/lab/Pagination';
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import SortableTableHead from "./SortableTableHead.js";
import ClearIcon from "@material-ui/icons/Clear";

// core components
import CustomInput from "../CustomInput/CustomInput.js";
import commonStyles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { primaryColor } from "assets/jss/material-dashboard-react.js";
import { withStyles } from "@material-ui/core/styles";

/**
* Theme for table pagination
*/
const PaginationTheme = withStyles({
  actions: {
    display: "none",
  },
  toolbar:{
    paddingLeft: "0",
  },
  root:{
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
  singleChild: {
    margin: "0 0 0 auto"
  },
  tableFooterDeleteButton: {
    justifyContent: "space-between"
  },
  spinner: {
    color: primaryColor[0]
  },
  addButton: {
    margin: "0"
  },
  searchInputContainer: {
    marginTop: 0,
    paddingBottom: 0
  },
  searchSectionBottom: {
    marginBottom: "10px"
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
  },
};

const useStyles = makeStyles(commonStyles);
const useAdditionalStyles = makeStyles(compStyles);

const CustomTable = props => {
  const classes = useStyles();
  const additionalClasses = useAdditionalStyles();

  const {
    tableHead,
    tableData,
    tableHeaderColor,
    onAddClick,
    page = 1,
    count = 0,
    onPageChange,
    onChangeRowsPerPage,
    rowsPerPageOptions = [20, 100, 250],
    rowsPerPage = 0,
    onSearch,
    addButtonText = "Add",
    showPagination = true,
    isSearch = true,
    isAddItem = true,
    isFooter = true,
    searchString,
    tableHeadCellClasses,
    tableRowCellClasses,
    isSortable = false,
    tableHeaderCells,
    onSortClick,
    defaultSorting,
    defaultSortingOrder,
    isResponsive = false,
    secondaryControlComponents,
    isSelectable = false,
    TableBodyComponent,
    deleteRowsComponent,
    deleteRows,
    isLoading,
    onClear
  } = props;

  const inputRef = useRef(null);

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

  const delayedSearch = debounce(e => {
    if (typeof onSearch === "function") {
      onSearch(e);
    }
  }, 300);

  const handleSearchChange = e => {
    e.persist();
    delayedSearch(e);
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
    <div className={classes.tableResponsive}>
      <div className={headStyles}>
        {isAddItem && (
          <Button
            color="primary"
            onClick={onAddClick}
            className={additionalClasses.addButton}
          >
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
              onChange={handleSearchChange}
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
      
      {showPagination && (tableData?.length || TableBodyComponent) ? (
        <PaginationTheme
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page-1}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : null}

      <Table className={tableStyle}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
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
        {isSortable && (
          <SortableTableHead
            tableHeaderCells={tableHeaderCells}
            onSortClick={onSortClick}
            defaultSorting={defaultSorting}
            defaultSortingOrder={defaultSortingOrder}
            tableHeaderColor={tableHeaderColor}
          />
        )}
        {isSelectable && TableBodyComponent ? (
          <TableBodyComponent />
        ) : (
          <TableBody>
            {!tableData?.length && !isLoading ? (
              <TableRow className={classes.tableBodyRow}>
                <TableCell
                  align="center"
                  className={classes.tableCell}
                  colSpan={tableHead?.length || tableHeaderCells?.length || 1}
                >
                  No data available in table
                </TableCell>
              </TableRow>
            ) : (
              (tableData || []).map((prop, key) => {
                return (
                  <TableRow key={key} className={classes.tableBodyRow}>
                    {prop.map((prop, key) => {
                      const tableRowCellStyle = classNames({
                        [classes.tableCell]: true,
                        ...(tableRowCellClasses
                          ? {
                              [tableRowCellClasses[key]]:
                                tableHeadCellClasses[key] !== undefined
                            }
                          : {})
                      });
                      return (
                        <TableCell className={tableRowCellStyle} key={key}>
                          {prop}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
            {isLoading && (
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={tableHead?.length || tableHeaderCells?.length || 1}
                >
                  <CircularProgress
                    color="primary"
                    className={additionalClasses.spinner}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>

      {isFooter && (
        <div className={footerStyle}>
          {deleteRows !== undefined && deleteRowsComponent}
          {showPagination && (tableData?.length || TableBodyComponent) ? (<Pagination  defaultPage={1}   count={(Math.ceil(count / rowsPerPage))} page={page} onChange={handleChangePage} variant="outlined"  shape="rounded"/>) : null}
        </div>
      )}
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
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
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
  secondaryControlComponents: PropTypes.node,
  isSelectable: PropTypes.bool,
  TableBodyComponent: PropTypes.any,
  deleteRowsComponent: PropTypes.node,
  deleteRows: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClear: PropTypes.func,
  rowsPerPageOptions: PropTypes.array
};

export default CustomTable;
