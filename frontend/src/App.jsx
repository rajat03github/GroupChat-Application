import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "../Pages/Homepage";
import ChatPage from "../Pages/ChatPage";
import "./App.css";

export const server = "http://localhost:5000/api";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/chats" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
