import axios from 'axios';

import { toast } from 'react-toastify';
import {
  loginFail,
  loginStart,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFail,
  updateCart,
} from './authSlice';

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post('/user/login', user);
    dispatch(loginSuccess(res.data));
    navigate('/');
  } catch (error) {
    dispatch(loginFail(error.response.data.msg));
  }
};
const options = {
  autoClose: 2000,
  type: toast.TYPE.INFO,
  hideProgressBar: false,
  position: toast.POSITION.TOP_CENTER,
  pauseOnHover: false,
  // and so on ...
};
export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    const res = await axios.post('/user/register', user);
    console.log(res);
    dispatch(registerSuccess());
    navigate('/login');
  } catch (error) {
    dispatch(registerFail(error.response.data.msg));
  }
};

export const addCartUser = async (
  cartItem,
  accessToken,
  dispatch,
  axiosJWT
) => {
  try {
    const res = await axiosJWT.post('/user/cart', cartItem, {
      headers: {
        Authorization: accessToken,
      },
    });

    dispatch(updateCart(res.data));
    toast.success('Added to cart', options);
  } catch (error) {
    console.log(error);
  }
};
export const updateCartItem = async (data, accessToken, dispatch, axiosJWT) => {
  try {
    const res = await axiosJWT.post('/user/update-cart', data, {
      headers: {
        Authorization: accessToken,
      },
    });

    console.log(res.data);
    dispatch(updateCart(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const order = async (data, accessToken, axiosJWT, navigate) => {
  try {
    const res = await axiosJWT.post('/user/order', data, {
      headers: {
        Authorization: accessToken,
      },
    });
    toast.success('Success', options);
    navigate('/');
  } catch (error) {
    toast.success(error.response.data, options);
  }
};
export const logoutUser = async (dispatch, navigate) => {
  try {
    const res = await axios.get('/user/logout');
    console.log(res);
    dispatch(loginSuccess(null));
    navigate('/');
  } catch (error) {
    console.log(error);
  }
};
