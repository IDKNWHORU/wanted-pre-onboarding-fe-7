import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TdForm = ({ td, load, tds }) => {
  const [mode, swap] = useState(false);
  const [content, change] = useState(td.todo);
  const [isCompleted, toggle] = useState(td.isCompleted);

  const editTd = (e) => {
    const todo = e.todo.value;
    const isCompleted = e.isCompleted.checked;
    fetch(`http://localhost:8000/todos/${td.id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("at")).access_token
        }`,
      },
      body: JSON.stringify({ todo, isCompleted }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        load(tds.map((td) => (td.id === data.id ? data : td)));
        swap(false);
      })
      .catch((err) => console.log(err));
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
      {mode === true ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editTd(e.target);
          }}
        >
          <input
            type="text"
            id="todo"
            value={content}
            onChange={({ target }) => change(target.value)}
          />
          <input
            type="checkbox"
            id="isCompleted"
            checked={isCompleted}
            onChange={(_) => toggle(!isCompleted)}
          />
          <button type="submit">submit</button>
          <button onClick={(_) => swap(false)}>cancel</button>
        </form>
      ) : (
        <p>
          {td.todo}, {td.isCompleted === true ? "완료" : "미완료"}
          <button onClick={(_) => swap(true)}>edit</button>
          <button onClick={(_) => deleteTD(td.id)}>delete</button>
        </p>
      )}
    </>
  );
};

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
            <TdForm load={load} td={td} tds={tds} />
          </li>
        ))}
      </ul>
    </>
  );
};
