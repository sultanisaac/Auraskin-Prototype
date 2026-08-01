import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import PricingPage from './pages/PricingPage';
import BookingPage from './pages/BookingPage';
import TreatmentDetail from './pages/TreatmentDetail';
import TreatmentsPage from './pages/TreatmentsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactPage from './pages/ContactPage';
import ExpertsPage from './pages/ExpertsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="treatments" element={<TreatmentsPage />} />
          <Route path="treatments/:id" element={<TreatmentDetail />} />
          <Route path="our-team" element={<ExpertsPage />} />
          <Route path="book-consultation" element={<BookingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
