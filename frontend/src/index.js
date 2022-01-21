import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Discord from "./callbacks/Discord";
import Login from "./pages/Login";
import "./style/style.css"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/callback/discord" element={ <Discord/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/" element={ <App/> } />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);