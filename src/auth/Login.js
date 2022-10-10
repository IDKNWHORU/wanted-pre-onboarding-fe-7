import { useState } from "react";

export const Login = () => {
  const [validInfo, setValid] = useState({ email: false, password: false });

  const validation = (form) => {
    const { email, password } = form;
    const rb = { email: email.value, password: password.value };

    fetch("http://localhost:8000/auth/signin", {
      method: "POST",
      body: JSON.stringify({ ...rb }),
      headers: { "Content-Type": "application/json" },
    });
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
      <h1>Login</h1>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validation(e.target);
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
