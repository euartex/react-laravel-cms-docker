//TODO: enhance when array and image is needed
// maybe should be added to axiosInstance for permanent converting data passing to the instance

export const convertToFormData = obj => {
  const form_data = new FormData();
  for (var key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key].length &&
        obj[key].forEach((arrItem, index) => {
          form_data.append(`${key}[${index}]`, arrItem);
        });
    } else {
      form_data.append(key, obj[key]);
    }
  }
  return form_data;
};
