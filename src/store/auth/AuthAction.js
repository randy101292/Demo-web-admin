export const SET_LOGIN = 'login';
export const SET_LOGOUT = 'logout';

export const login = () => ({
  type: SET_LOGIN,
});

export const logout = () => ({
  type: SET_LOGOUT,
});