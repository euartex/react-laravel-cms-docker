import React, {useState} from "react";

// @material-ui/core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import StaticPages from "./StaticPages";
import ArticlesTab from "./ArticlesTab";

import { isAllowed, isAllowEdit } from "helpers/routeChecker";

export default function Static() {
  const [defaultTab, setDefTab] = useState(0);
  const tabsArr = [];

  // setDefTab(0);

  if (isAllowed("/static-page")) {
    tabsArr.push({
      tabName: "Static Pages",
      tabContent: <StaticPages allowEdit={isAllowEdit("static.page")} />
    });
  }

  if (isAllowed("/articles")) {
    tabsArr.push({
      tabName: "Articles",
      //TODO: there is some bug if allowEdit = false(table always empty)
      tabContent: <ArticlesTab allowEdit={true} />
    });
  }

  return (
    <div>
      <CustomTabs headerColor="info" tabs={tabsArr}></CustomTabs>
    </div>
  );
}
