export default {
  extract: (values, whiteList) => {
    let output = {};
    let error = false;

    whiteList.forEach(item => {
      if (item.required && typeof values[item.valueName] === 'undefined' ) {
        error = true;
      }
      if (typeof values[item.valueName] !== 'undefined') {
        switch (item.dataType) {
          case 'number':
            output[item.valueName] = Number(values[item.valueName]);
            break;
          default:
            output[item.valueName] = values[item.valueName];
        }
      }
    });

    if (error === true) {
      return false;
    }

    return output;
  }
};
