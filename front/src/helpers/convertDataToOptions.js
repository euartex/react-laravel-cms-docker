export const convertDataToOptions = data =>
  //assets with status draft should be gray, options with status field for assets
  Array.isArray(data)
    ? data.map(({ id, name, title, status }) => {
        return name
          ? { value: id, label: name, ...(status && { status }) }
          : { value: id, label: title, ...(status && { status }) };
      })
    : [];

export const convertDataToOptionsByKey = (data, valueKey, labelKey) => {
  if (Array.isArray(data)) {
    return data
      .map(item => {
        if (typeof item === "object") {
          return { value: item[valueKey], label: item[labelKey] };
        }
        if (item) {
          return { value: item, label: item };
        }
        return null;
      })
      .filter(element => Boolean(element) === true);
  }
  return [];
};
