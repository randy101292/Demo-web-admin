import store from "../redux/store";

// WARNING: This is not a drop in replacement solution and
// it might not work for some edge cases. Test your code!
export const getVal = (obj, path, defValue) => {
  // If path is not defined or it has false value
  if (!path) return undefined;
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
  // Regex explained: https://regexr.com/58j0k
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  // Find value
  const result = pathArray.reduce(
    (prevObj, key) => prevObj && prevObj[key],
    obj
  );
  // If found value is undefined return default value; otherwise return the value
  return result === undefined ? defValue : result;
};

// WARNING: This is not a drop in replacement solution and
// it might not work for some edge cases. Test your code!
export const setVal = (obj, path, value) => {
  // Regex explained: https://regexr.com/58j0k
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);

  pathArray.reduce((acc, key, i) => {
    if (acc[key] === undefined) acc[key] = {};
    if (i === pathArray.length - 1) acc[key] = value;
    return acc[key];
  }, obj);
};

export const deepClone = (source) => {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });

  return targetObj;
};

export const canAccess = (permissions) => {
  const state = store.getState();

  const myPermissions = !Array.isArray(permissions)
    ? [permissions]
    : permissions;

  const containsAll = myPermissions.every((element) => {
    return state.auth.permissions.includes(element);
  });

  return containsAll;
};

export const getUpdateList = (list, index, item) => {
  // console.log("list", list);
  // console.log("index", index);
  // console.log("item", item);
  let apiDataItems = [...list];
  apiDataItems.splice(index, 1, item);
  //COMMENTED JPG 06132022
  //apiDataItems.splice(index, 0, item);

  return apiDataItems;
};

// export const BOOKING_TIME = () =>

//   [{
//     label: "a",
//     value: "a",
//   }
// ];

export const BOOKING_TIME = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];
