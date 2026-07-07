import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Infrastructure from './pages/Infrastructure';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import CaseStudies from './pages/CaseStudies';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
