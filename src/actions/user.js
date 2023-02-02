import {
  LOGOUT,
  SET_CHECKING,
  SET_ADMIN
} from './type';

export const setChecking = checking => {
    return {
        type: SET_CHECKING,
        payload: checking,
    }
}
export const setAdmin = admin => {
    return {
        type: SET_ADMIN,
        payload: admin
    }
}
export const logout = history => {
    console.log("logout")
    localStorage.removeItem("exchange_access_token");
    history.push('/auth-login');
    return {
        type: LOGOUT,
    }
}