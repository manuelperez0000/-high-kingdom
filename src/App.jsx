
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Terrain from './pages/terrain';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game/:gameId" element={<Game />} />
          <Route path="/game" element={<Game />} />
          <Route path="/terrain" element={<Terrain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
