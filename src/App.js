import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { PostView } from "./pages/PostView";
import { Posts } from "./pages/Posts";
import { Home } from "./pages/Home";
import { Messages } from "./pages/Messages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/posts/:post_id" element={<PostView />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </div>
  );
}

export default App;
