import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './v2/components/Layout';
import Home from './v2/pages/Home';

// Home carries the hero and is the overwhelmingly common entry point, so it
// stays in the main chunk. Every other route is split.
const Products = lazy(() => import('./v2/pages/Products'));
const ProductDetail = lazy(() => import('./v2/pages/ProductDetail'));
const About = lazy(() => import('./v2/pages/About'));
const Infrastructure = lazy(() => import('./v2/pages/Infrastructure'));
const Contact = lazy(() => import('./v2/pages/Contact'));
const FAQ = lazy(() => import('./v2/pages/FAQ'));
const CaseStudies = lazy(() => import('./v2/pages/CaseStudies'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-ki-ground" />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="infrastructure" element={<Infrastructure />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="case-studies" element={<CaseStudies />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
