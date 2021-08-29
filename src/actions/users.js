import { GET_ALL_USERS, SHOW_MESSAGE } from '../constants/actionTypes';
import API from '../middleware/index';

export const getAllUsers = () => {
  return async (dispatch) => {
    let url = '/users';
    let method = 'GET';
    const headers = {
      'Content-Type': 'application/json',
    };
    let response = await API({ url, method, headers });
    const body = response && response.data ? response.data : [];
    if (response.code === 200 && body.length) {
      dispatch({
        type: GET_ALL_USERS,
        payload: body ? body : {},
      });
    } else if (response.code !== 200) {
      dispatch({
        type: SHOW_MESSAGE,
        payload: body && body.data ? body.data : {},
      });
    }
  };
};

export const getPostByUserID = async (id) => {
  let url = `/posts?userId=${id}`;
  let method = 'GET';
  const headers = {
    'Content-Type': 'application/json',
  };
  let response = await API({ url, method, headers });
  const body = response && response.data ? response.data : [];
  return body;
};

export const getUserDetailsById = async (id) => {
  let url = `/users/${id}`;
  let method = 'GET';
  const headers = {
    'Content-Type': 'application/json',
  };
  let response = await API({ url, method, headers });
  const body = response && response.data ? response.data : [];
  return body;
};
