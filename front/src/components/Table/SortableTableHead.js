import React, { useState } from "react";
import { array, func, string } from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import commonStyles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(commonStyles);

SortableTableHead.propTypes = {
  tableHeaderCells: array,
  onSortClick: func,
  defaultSorting: string,
  defaultSortingOrder: string,
  tableHeaderColor: string
};

export default function SortableTableHead({
  tableHeaderCells,
  onSortClick,
  defaultSorting,
  defaultSortingOrder,
  tableHeaderColor
}) {
  const classes = useStyles();

  const [sortBy, setSortBy] = useState(defaultSorting);
  const [orderBy, setOrderBy] = useState(defaultSortingOrder);

  if (!tableHeaderCells.length) {
    return null;
  }

  return (
    <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
      <TableRow className={classes.tableHeadRow}>
        {tableHeaderCells.map(prop => {
          return (
            <TableCell
              className={classes.tableCell + " " + classes.tableHeadCell}
              key={prop.id}
              sortDirection={sortBy === prop.value ? orderBy : false}
            >
              {prop.isSortable ? (
                <TableSortLabel
                  active={prop.value === sortBy}
                  direction={sortBy === prop.value ? orderBy : "asc"}
                  onClick={() => {
                    let sortOrderToPass = "asc";
                    if (sortBy === prop.value) {
                      sortOrderToPass = orderBy === "desc" ? "asc" : "desc";
                      setOrderBy(prevSortOrder =>
                        prevSortOrder === "desc" ? "asc" : "desc"
                      );
                    } else {
                      setOrderBy("asc");
                    }
                    setSortBy(prop.value);
                    onSortClick({
                      sortBy: prop.value,
                      orderBy: sortOrderToPass
                    });
                  }}
                >
                  {prop.label}
                </TableSortLabel>
              ) : (
                prop.label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
