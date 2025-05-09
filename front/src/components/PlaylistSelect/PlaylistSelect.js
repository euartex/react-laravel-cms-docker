import React, { useContext } from "react";

import Select from "../CustomSelect/CustomSelect";

import { convertDataToOptions } from "helpers/convertDataToOptions";
import Context from "helpers/context";

const PlaylistSelect = props => {
  const { playlists } = useContext(Context);

  return <Select options={convertDataToOptions(playlists)} {...props} />;
};

export default PlaylistSelect;
