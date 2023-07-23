import React, { Suspense, lazy } from "react";
import { Link, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home/index";
// import About from "./pages/About/index";

// /* webpackChunkName: "Home" */ 是webpack的魔法命名
const Home = lazy(() => import(/* webpackChunkName: "Home" */"./pages/Home/index"));
const About = lazy(() => import(/* webpackChunkName: "About" */"./pages/About/index"));

const App = () => {
  return (
    <div>
      <h1>App</h1>

      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      <Suspense fallback="loading">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
