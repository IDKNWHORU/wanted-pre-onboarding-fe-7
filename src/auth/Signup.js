import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const nv = useNavigate();
  const [validInfo, setValid] = useState({ email: false, password: false });

  const createUser = (form) => {
    const { email, password } = form;
    const rb = { email: email.value, password: password.value };

    fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      body: JSON.stringify({ ...rb }),
      headers: { "Content-Type": "application/json" },
    }).then(nv("/"));
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

  return (
    <article>
      <h1>Signup</h1>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createUser(e.target);
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
            Sign up
          </button>
        </form>
      </main>
    </article>
  );
};
