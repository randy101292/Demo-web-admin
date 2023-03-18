export const fireUrl = (url) => {
  return process.env.REACT_APP_FIRESTORE_URL + url;
};

export const laravelUrl = (url) => {
  return process.env.REACT_APP_LARAVEL_URL + url;
};

export const getSegment = (index) => {
  var url = window.location.href.split("/");
  url.shift();
  url.shift();
  url.shift();
  url.shift();
  return url[index - 1];
};
