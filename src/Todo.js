import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Todo = () => {
  const [tds, load] = useState([]);
  const nv = useNavigate();
  useEffect(() => {
    if (localStorage.length === 0) {
      nv("/");
    }

    fetch("http://localhost:8000/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("at")).access_token
        }`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((tds) => {
        load(tds);
      })
      .catch(console.error);
  }, []);

  const createTodo = (tf) => {
    fetch("http://localhost:8000/todos", {
      method: "post",
      body: JSON.stringify({
        todo: tf.td.value,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("at")).access_token
        }`,
      },
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((td) => {
        load([...tds, td]);
      })
      .catch(console.error);
  };

  const deleteTD = (id) => {
    fetch(`http://localhost:8000/todos/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("at")).access_token
        }`,
      },
    }).then((res) => {
      if (res.status === 204) {
        load(tds.filter((td) => td.id !== id));
      } else {
        throw new Error(res.statusText);
      }
    });
  };

  return (
    <>
      <h1>Todo</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo(e.target);
        }}
      >
        <input type="text" id="td" laceholder="Enter your todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tds.map((td) => (
          <li key={td.id}>
            <p>
              {td.todo}, {td.isCompleted === true ? "완료" : "미완료"}
              <button>edit</button>
              <button onClick={(_) => deleteTD(td.id)}>delete</button>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};
