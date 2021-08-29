import axios from 'axios';

let urlConfig = 'http://jsonplaceholder.typicode.com';
const instance = axios.create({
  baseURL: urlConfig,
});

const API = async (reqObj) => {
  return await new Promise(async (resolve) => {
    let response;
    try {
      response = await instance(reqObj);
      let responseObj = {
        code: response.status,
        data: response.data,
        message: response.data.message,
      };
      resolve(responseObj);
    } catch (error) {
      let { response } = error;
      let errorObj = {
        code: response.status,
        status: response.data && response.data.status,
        message: response.data && response.data.message,
        data: '',
      };
      resolve(errorObj);
    }
  });
};

export default API;
