import { useState } from 'react';
import './App.css';

function App() {
  const [validInfo, setValid] = useState({email: false, password: false});

  const validation = form => {
    const {email, password} = form;

  }

  const validEmail = email => {
    setValid({email: email.target.value.includes(String.fromCharCode(64)), password: validInfo.password});
  }

  const validPassword = password => {
    setValid({email: validInfo.email, password: password.target.value.length >= 8});
  }

  return (
    <div className="App">
      <header className="App-header">
        <article>
          <h1>Login</h1>
          <main>
            <form onSubmit={(e)=>{e.preventDefault(); validation(e.target);}}>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" placeholder='@ included email address' onChange={validEmail}/>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" minLength={8} onChange={validPassword}/>
              {validInfo.email === true && validInfo.password === true && <button type="submit">Login</button>}
            </form>
          </main>
        </article>
      </header>
    </div>
  );
}

export default App;
