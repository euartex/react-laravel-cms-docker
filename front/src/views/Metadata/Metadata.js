import React from "react";

// @material-ui/core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import CategoryTab from "./CategoryTab";
import TagsTab from "./TagsTab";

import { isAllowed, isAllowEdit } from "helpers/routeChecker";

export default function Metadata() {
  const tabsArr = [];
  if (isAllowed("/metadata")) {
    tabsArr.push({
      tabName: "Category",
      tabContent: <CategoryTab allowEdit={isAllowEdit("metadata")} />
    });
  }
  if (isAllowed("/tag")) {
    tabsArr.push({
      tabName: "Tags",
      tabContent: <TagsTab allowEdit={isAllowEdit("tag")} />
    });
  }

  return (
    <div>
      <CustomTabs headerColor="info" tabs={tabsArr}></CustomTabs>
    </div>
  );
}
