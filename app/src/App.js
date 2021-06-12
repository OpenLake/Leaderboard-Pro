import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Checkbox } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { darkTheme, lightTheme } from './theme.js';


function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = localStorage.getItem("darkMode")
    ? localStorage.getItem("darkMode") === "true"
    : prefersDark;
  const [darkMode, setDarkMode] = useState(isDark);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {darkMode ? "Dark" : "Light"}
          <Checkbox checked={darkMode} onClick={() => toggleDarkMode()} />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
