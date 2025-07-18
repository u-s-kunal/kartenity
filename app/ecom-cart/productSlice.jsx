import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: [],
  reducer: {
    addProduct: (state, action) => state.push(action.payload),
  },
});

export const { addProduct } = productSlice.actions;
export default productSlice.reducer;
