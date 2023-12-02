import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./pages/Feed/Feed";
import Navbar from "./components/Navbar/Navbar";
import VideoDetails from "./pages/VideoDetails/VideoDetails";
import Subscriptions from "./pages/Subscriptions/Subscriptions";
import Auth from "./pages/Auth/Auth";
import ChannelDetails from "./pages/ChannelDetails/ChannelDetails";
import Dashboard from "./pages/Dashboard/Dashboard";
import SearchFeed from "./pages/SearchFeed/SearchFeed";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/watch/:videoId" element={<VideoDetails />} />
        <Route path="/feed/subscriptions" element={<Subscriptions />} />
        {/* <Route path="/feed/you" element={} /> */}
        <Route path="/accounts/*" element={<Auth />} />
        <Route path="/studio/channel/:channelId" element={<Dashboard />} />
        <Route path="/channel/:channelId" element={<ChannelDetails />} />
        <Route path="/search/:query" element={<SearchFeed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
