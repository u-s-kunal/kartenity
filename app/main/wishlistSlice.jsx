import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    addToWish: (state, action) => {
      const existing = state.find((item) => item._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromWish: (state, action) => {
      const _id = action.payload;
      const index = state.findIndex((item) => item._id === _id);
      if (index !== -1) {
        if (state[index].quantity > 1) {
          state[index].quantity -= 1;
        } else {
          state.splice(index, 1);
        }
      }
    },

    clearWish: () => {
      // Simply return an empty array to clear the wish
      return [];
    },
  },
});

export const { addToWish, removeFromWish, clearWish } = wishlistSlice.actions;

export default wishlistSlice.reducer;
