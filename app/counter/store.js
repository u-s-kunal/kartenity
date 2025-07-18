"use client";

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./conuterSlice.jsx";
import todoReducer from "../todo/todoSlice.jsx";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
  },
});
