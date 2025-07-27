import { createSlice } from "@reduxjs/toolkit";

const localCart =
  typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cart")) : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: localCart || [],
  reducers: {
    addToCart: (state, action) => {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        if (state[index].quantity > 1) {
          state[index].quantity -= 1;
        } else {
          state.splice(index, 1);
        }
      }
    },
    clearCart: () => [],
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
