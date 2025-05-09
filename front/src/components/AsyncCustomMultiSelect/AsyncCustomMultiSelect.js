import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import MultiSelect from "../CustomMultiSelect/CustomMultiSelect";

import axiosInstance from "config/axiosInstance";
import {
  convertDataToOptions,
  convertDataToOptionsByKey
} from "helpers/convertDataToOptions";

const AsyncCustomMultiSelect = props => {
  const { url, customOptionFields, ...restProps } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    axiosInstance.get(url).then(res => {
      setData(res?.data?.data);
    });
  }, [url]);

  const options = useMemo(
    () =>
      customOptionFields
        ? convertDataToOptionsByKey(data, ...customOptionFields)
        : convertDataToOptions(data),
    [data]
  );
  return <MultiSelect options={options} {...restProps} />;
};

AsyncCustomMultiSelect.propTypes = {
  url: PropTypes.string,
  customOptionFields: PropTypes.array
};
export default AsyncCustomMultiSelect;
