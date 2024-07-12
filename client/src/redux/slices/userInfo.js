import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    modifyUserInfo: (state, action) => {
      return action.payload !== null ? { ...state, ...action.payload } : {};
    },
  },
});

export const { modifyUserInfo } = userInfoSlice.actions;
export const selectUserInfo = (state) => state.userInfo;

export default userInfoSlice.reducer;
