import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useAuthContext } from '@contexts/useAuthContext';

import Nav from '@components/Nav';
import Home from '@pages/Home';
import Signup from '@pages/Signup';
import Footer from '@components/Footer';

function App() {
  // Teaching material: using context with any-typed value
  const { user, loading } = useAuthContext();

  return (
    <>
      {loading && <div className="p-2 text-sm opacity-70">Loading…</div>}
      {user && <div className="p-2 text-sm opacity-70">Welcome!</div>}
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
