import React, { useContext } from "react";

import Select from "../CustomSelect/CustomSelect";

import { convertDataToOptions } from "helpers/convertDataToOptions";
import Context from "helpers/context";

const CompanySelect = props => {
  const { companies } = useContext(Context);

  return <Select options={convertDataToOptions(companies)} {...props} />;
};

export default CompanySelect;
