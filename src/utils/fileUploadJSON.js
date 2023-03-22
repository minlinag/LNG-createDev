const fileUploadJSON = {
  toJsonString: ((val) => {
    return JSON.stringify(val)
  }),
  toParse: ((val) => {
    if (val) {
      return JSON.parse(val.replace(/“/g, '"'))
    }

  }),

};
export default fileUploadJSON