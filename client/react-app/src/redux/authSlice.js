import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.error = false;
      state.login.currentUser = action.payload;
    },
    loginFail: (state, action) => {
      state.login.isFetching = false;
      state.login.error = action.payload;
    },
    registerStart: (state) => {
      state.login.isFetching = true;
    },
    registerSuccess: (state) => {
      state.login.isFetching = false;
      state.login.error = false;
    },
    registerFail: (state, action) => {
      state.login.isFetching = false;
      state.login.error = action.payload;
    },
    updateCart: (state, action) => {
      state.login.currentUser.cart = action.payload;
    },
    changeQuantity: (state, action) => {
      // const _id = action.payload._id;
      // state.login.currentUser.cart.forEach((item) => {
      //   if (item._id === _id) {
      //     if ((action.payload.type = 'dec')) item.quantity--;
      //     else item.quantity++;
      //   }
      // });
      console.log(action.payload);
      console.log(state.login.currentUser);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFail,
  registerStart,
  registerSuccess,
  registerFail,
  updateCart,
  changeQuantity,
} = authSlice.actions;
export default authSlice.reducer;
