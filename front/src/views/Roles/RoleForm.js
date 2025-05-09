import React from "react";
import { func, string, array, bool, object } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Table from "components/Table/Table.js";

import checkBoxStyles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";

const compStyles = {
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
  permissionTable: {
    "& .MuiTableCell-root": {
      borderBottom: 0,
      padding: 0
    },
    "& .MuiTableCell-root:nth-child(2)": {
      textAlign: 'right'
    }
  },
  footer: {
    display: "flex",
    justifyContent: "space-between"
  },
  checkboxContainer: {
    marginLeft: "-13px"
  }
};
const styles = { ...checkBoxStyles, ...compStyles };

const useStyles = makeStyles(styles);

const RoleForm = ({
  permissions,
  handleSubmit,
  onClose,
  dataForm,
  isLoading,
  handleChange
}) => {
  const classes = useStyles();
  const { newRoleName, checkedPermissions } = dataForm;

  const groupBy = (arr, property) => {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  const groupedPermissions = groupBy(permissions, 'group');

  const getTableRows = () => {

    return Object.keys(groupedPermissions).map(key => {
      let isAllChecked = true;
      const groupRows = groupedPermissions[key].map(permission => {
        const isChecked = !!checkedPermissions.find(
          checkPerm =>
            checkPerm.slug === permission.slug
        );
        if (!isChecked) isAllChecked = false;

        return [
          permission.name,
          <>
            <Checkbox
              checked={isChecked}
              tabIndex={-1}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: `${classes.root} ${classes.checkboxContainer}`
              }}
              name="checkedPermissions"
              onChange={() => {
                const newSelectedPerm = checkedPermissions.find(
                  checkPerm =>
                    checkPerm.slug === permission.slug
                )
                  ? checkedPermissions.filter(
                      perm =>
                        !(perm.slug === permission.slug)
                    )
                  : [
                      ...checkedPermissions,
                      permission
                    ];

                handleChange({
                  target: { name: "checkedPermissions", value: newSelectedPerm }
                });
              }}
            />
          </>
        ];
      });

      const group = [[
        <h3>{key}</h3>,
        <>
          <Checkbox
            checked={isAllChecked}
            tabIndex={-1}
            checkedIcon={<Check className={classes.checkedIcon} />}
            icon={<Check className={classes.uncheckedIcon} />}
            classes={{
              checked: classes.checked,
              root: `${classes.root} ${classes.checkboxContainer}`
            }}
            name="checkedPermissions"
            onChange={() => {
              const newSelectedPerm = isAllChecked
                ? checkedPermissions.filter(
                    perm =>
                      !(perm.group === key)
                  )
                : [
                    ...checkedPermissions,
                    ...groupedPermissions[key].map((permission) => permission)
                  ];

              handleChange({
                target: { name: "checkedPermissions", value: newSelectedPerm }
              });
            }}
          />
        </>
      ]].concat(groupRows);

      return group;
    });
  };

  const tableRows = getTableRows();
  useSubmitOnEnter(handleSubmit);

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                Role
                <span
                  className={`material-icons ${classes.closeButton}`}
                  onClick={onClose}
                >
                  clear
                </span>
              </h4>
            </CardHeader>
            <CardBody className={classes.permissionTable}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Role name *"
                    id="new-role-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newRoleName}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "newRoleName",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  {tableRows.map((table, index) => 
                    <Table
                      key={index}
                      tableData={table}
                      showPagination={false}
                      isSearch={false}
                      isFooter={false}
                      isAddItem={false}
                    />
                  )}
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                color="info"
                disabled={!newRoleName.length || isLoading}
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

RoleForm.propTypes = {
  roleName: string,
  permissions: array,
  onClose: func,
  handleSubmit: func,
  dataForm: object,
  isLoading: bool,
  handleChange: func
};

export default RoleForm;
