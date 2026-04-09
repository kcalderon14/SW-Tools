import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RedirectsPage from './pages/RedirectsPage';
import RedirectTestingPage from './pages/RedirectTestingPage';
import HtmlHelpersPage from './pages/HtmlHelpersPage';
import ListGeneratorPage from './pages/ListGeneratorPage';
import ResourceCenterIndexCardPage from './pages/ResourceCenterIndexCardPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/redirects" replace />} />
        <Route path="/redirects" element={<RedirectsPage />} />
        <Route path="/redirects/testing" element={<RedirectTestingPage />} />
        <Route path="/html-helpers/link-builder" element={<HtmlHelpersPage />} />
        <Route path="/html-helpers/list-generator" element={<ListGeneratorPage />} />
        <Route path="/builder/resource-center-index-card" element={<ResourceCenterIndexCardPage />} />
      </Routes>
    </Layout>
  );
}
