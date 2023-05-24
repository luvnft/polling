import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// routes
import PublicFeed from "./Feeds/PublicFeed";
import BoardRoomFeed from "./Feeds/BoardRoomFeed";


// define relays
export const RELAYS = [
  "wss://nostr.pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss.enigma.ch",
  "wss://relay.damus.io",
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicFeed />} />
      <Route path="/boardroom/:userId" element={<BoardRoomFeed />} />
    </Routes>
  )
}

export default App
