import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RedirectsPage from './pages/RedirectsPage';
import RedirectTestingPage from './pages/RedirectTestingPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RedirectsPage />} />
        <Route path="/testing" element={<RedirectTestingPage />} />
      </Routes>
    </Layout>
  );
}
