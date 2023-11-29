import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./pages/Feed/Feed";
import Navbar from "./components/Navbar/Navbar";
import VideoDetails from "./pages/VideoDetails/VideoDetails";
import Subscriptions from "./pages/Subscriptions/Subscriptions";
import Auth from "./pages/Auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/watch/:videoId" element={<VideoDetails />} />
        <Route path="/feed/subscriptions" element={<Subscriptions />} />
        <Route path="/accounts/*" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
