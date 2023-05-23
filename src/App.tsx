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
    <Router>
         <Routes>
            <Route path="/" element={<PublicFeed/>} />
            <Route path="/interests" element={null} />
            <Route path="/boardroom/:userId" element={<BoardRoomFeed />} />
            <Route element={null} /> {/* A catch-all route for 404 errors */}
         </Routes>
      </Router>
  )
}

/*
#2A2C3C - Deep Space
#332A48 - Nebula Purple
#3F315A - Galactic Purple
#3E527F - Midnight Blue
#5077A8 - Starry Blue
#87A4C5 - Nebula Sky
#C5E0F6 - Stellar White
#F4F7FA - Cosmic Gray
#FBBFCC - Supernova Pink
#F493B0 - Celestial Rose
#5DAE86 - Emerald Green
#48BB78 - Lush Green
#38A169 - Forest Green
#2F855A - Deep Green
#276749 - Pine Green
*/

export default App
