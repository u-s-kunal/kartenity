import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, deleteTodo } from "./todoSlice";

function TodoApp() {
  const [input, setInput] = useState("");
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const inputHandler = (e) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <input type="text" value={input} onChange={(e) => inputHandler(e)} />
      <button
        className="bg-green-700"
        onClick={() => {
          dispatch(addTodo(input));
          setInput(" ");
        }}
      >
        Add Todo
      </button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-gray-500 pl-3 m-2 text-1.5xl align-middle"
          >
            <p> {todo.text}</p>
            <button
              className="bg-red-700"
              onClick={() => dispatch(deleteTodo(todo.id))}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
