import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type User = {
  authenticationType: string;
  email: string;
  externalUserId: string;
  firstName: string;
  lastName: string;
  id: number;
  isActive: boolean;
  userName: string;
  profilePic: string;
};

type UserData = {
  auth_token: string;
  id: number;
  roles: Array<any>;
  user: User;
};

// Define a type for the slice state
interface UserState {
  user: UserData | null;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<UserData>) => {
      state.user = { ...state.user, ...action.payload };
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
});

export const { addUser, updateUser, removeUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.UserReducer.user;

export default userSlice.reducer;
