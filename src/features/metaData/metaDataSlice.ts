import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface MetaDataState {
  metaData: object | null;
}

const initialState: MetaDataState = {
  metaData: null,
};

export const metaDataSlice = createSlice({
  name: "metaData",
  initialState,
  reducers: {
    addMetaData: (state, action: PayloadAction<Object>) => {
      state.metaData = action.payload;
    },
    updateMetaData: (state, action: PayloadAction<Object>) => {
      state.metaData = { ...state.metaData, ...action.payload };
    },
    removeMetaData: (state) => {
      state.metaData = null;
    },
  },
});

export const { addMetaData, updateMetaData, removeMetaData } =
  metaDataSlice.actions;

export const selectMetaData = (state: RootState) =>
  state.MetaDataReducer.metaData;

export default metaDataSlice.reducer;
