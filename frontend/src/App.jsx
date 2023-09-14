import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import ChatProvider from "./Context/ChatProvider";

export const server = "http://localhost:5000/api";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/chats" element={<ChatPage />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
