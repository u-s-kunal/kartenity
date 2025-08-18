"use client";

import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./main/productSlice.jsx";
import cartReducer from "./main/cartSlice.jsx";
import whishlistReducer from "./main/wishlistSlice.jsx";

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: whishlistReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem("cart", JSON.stringify(store.getState().cart));
  localStorage.setItem("products", JSON.stringify(store.getState().products));
});
