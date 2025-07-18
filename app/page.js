"use client";

import Counter from "./counter/Counter";
import { store } from "./counter/store";
import { Provider } from "react-redux";
import TodoApp from "./todo/TodoApp";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <Counter />
        <TodoApp />
      </div>
    </Provider>
  );
}
