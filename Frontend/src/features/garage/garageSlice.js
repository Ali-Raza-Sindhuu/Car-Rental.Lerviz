import { createSlice } from "@reduxjs/toolkit";
import { readGuestGarage } from "./garageStorage";

const garageSlice = createSlice({
  name: "garage",
  initialState: {
    guestItems: readGuestGarage(),
    message: "",
  },
  reducers: {
    setGuestItems: (state, action) => {
      state.guestItems = action.payload;
    },
    setGarageMessage: (state, action) => {
      state.message = action.payload;
    },
    clearGarageMessage: (state) => {
      state.message = "";
    },
  },
});

export const { setGuestItems, setGarageMessage, clearGarageMessage } = garageSlice.actions;
export default garageSlice.reducer;
