import React, { useContext } from "react";

import Select from "../CustomSelect/CustomSelect";

import { convertDataToOptions } from "helpers/convertDataToOptions";
import Context from "helpers/context";

const ProjectSelect = props => {
  const { projects } = useContext(Context);

  return <Select options={convertDataToOptions(projects)} {...props} />;
};

export default ProjectSelect;
