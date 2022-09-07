import axios from 'axios';
import jwt_decode from 'jwt-decode';

const refreshToken = async () => {
  try {
    const res = await axios.get('/user/refresh_token');
    return res.data;
  } catch (err) {
    console.log('lỗi ở refreshToken');
    alert('Please login or register');
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwt_decode(user?.accesstoken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accesstoken: data.accesstoken,
        };
        dispatch(stateSuccess(refreshUser));
        config.headers['Authorization'] = data.accesstoken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return newInstance;
};
