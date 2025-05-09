import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";

import { isAllowed, isAllowEdit } from "helpers/routeChecker";

import CustomTabs from "components/CustomTabs/CustomTabs.js";
import ProgramsPage from "./ProgramsTab";
import ShowsPage from "./ShowsTab";

export default function EPG() {
  const [defaultTab, setDefTab] = useState(0);
  const { type } = useParams();
  const history = useHistory();

  useEffect(() => {
    let userObj = localStorage.getItem("user");
    if (!userObj) {
      history.push("/404");
    }
  }, []);

  useEffect(() => {
    if ((type === "program" || type === ":type") && isAllowed("/epg/program")) {
      setDefTab(0);
      if (type === ":type") {
        window.history.replaceState("", "", "/epg/program");
      }
    } else if (type === "show" && isAllowed("/epg/show")) {
      setDefTab(1);
      if (type === ":type") {
        window.history.replaceState("", "", "/epg/show");
      }
    } else if (type === ":type" && isAllowed("/epg/show")) {
      setDefTab(1);
      window.history.replaceState("", "", "/epg/show");
    } else {
      history.push("/404");
    }
  }, [type]);
console.log('WORKING', isAllowed("/epg/program"));
  const tabItems = [];
  if (isAllowed("/epg/program")) {
    tabItems.push({
      tabName: "Electronic Program Guide",
      tabContent: <ProgramsPage allowEdit={isAllowEdit("program")} />,
      path: "/epg/program"
    });
  }
  if (isAllowed("/epg/show")) {
    tabItems.push({
      tabName: "Shows",
      tabContent: <ShowsPage allowEdit={isAllowEdit("show")} />,
      path: "/epg/show"
    });
  }
  if (tabItems.length === 1 && defaultTab === 1) {
    setDefTab(0);
  }
  return (
    <div>
      <CustomTabs
        headerColor="info"
        tabs={tabItems}
        isNavigation={true}
        initialTab={defaultTab}
      />
    </div>
  );
}
