import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// routes
import PublicFeed from "./Feeds/PublicFeed";
import BoardRoomFeed from "./Feeds/BoardRoomFeed";
import Interests from './Components/Interests';


// define relays
export const RELAYS = [
  "wss://nostr.pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss.enigma.ch",
  "wss://relay.damus.io",
];

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Interests />} />
        <Route path="/public/:privateKey" element={<PublicFeed />} />
        <Route path="/boardroom/:userId/:privateKey" element={<BoardRoomFeed />} />
      </Routes>
    </div>
  )
}

export default App
