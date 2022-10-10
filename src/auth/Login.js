import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [validInfo, setValid] = useState({ email: false, password: false });
  const nv = useNavigate();

  const auth = (form) => {
    const { email, password } = form;
    const rb = { email: email.value, password: password.value };

    fetch("http://localhost:8000/auth/signin", {
      method: "POST",
      body: JSON.stringify({ ...rb }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((at) => {
        localStorage.setItem("at", JSON.stringify(at));
        nv("todo");
      })
      .catch(console.error);
  };

  const validEmail = (email) => {
    setValid({
      email: email.target.value.includes(String.fromCharCode(64)),
      password: validInfo.password,
    });
  };

  const validPassword = (password) => {
    setValid({
      email: validInfo.email,
      password: password.target.value.length >= 8,
    });
  };

  useEffect(() => {
    if (localStorage.length === 1) {
      nv("/todo");
    }
  }, []);

  return (
    <article>
      <h1>Login</h1>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            auth(e.target);
          }}
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="@ included email address"
            onChange={validEmail}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            minLength={8}
            onChange={validPassword}
          />
          <button
            type="submit"
            disabled={validInfo.email === false || validInfo.password === false}
          >
            Login
          </button>
        </form>
      </main>
    </article>
  );
};
