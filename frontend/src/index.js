import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Discord from "./callbacks/Discord";
import Login from "./pages/Login";
import "./style/style.css"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { AnimatePresence } from 'framer-motion'

ReactDOM.render(
  <React.StrictMode>
    <AnimatePresence>
    <Router>
      <Routes>
        <Route path="/callback/discord" element={ <Discord/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/" element={ <App/> } />
      </Routes>
    </Router>
    </AnimatePresence>
  </React.StrictMode>,
  document.getElementById('root')
);