/* global module */

const ModelHelpers = {
  filterPrivate: (values, model) => {
    let safeRecord = Object.assign({}, values);
    model
      .filter((item) => item.private)
      .map((item) => item.valueName)
      .forEach((item) => {
        delete safeRecord[item];
      });

    return safeRecord;
  },

  filterPrivateSet: (valueSet, model) => {
    return valueSet.map((value) => {
      return ModelHelpers.filterPrivate(value, model);
    });
  }
};

module.exports = ModelHelpers;
