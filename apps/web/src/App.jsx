import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import AdminPage from './pages/Admin';
import HomePage from './pages/HomePage';
import { JobSearchPage, JobDetailPage, EmployersPage, CandidatesPage, ServicesPage, AboutPage, SubmitCvPage, UploadVacancyPage, ContactPage, ResourcesPage, LegalPage } from './pages/Pages';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobSearchPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/employers" element={<EmployersPage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/submit-cv" element={<SubmitCvPage />} />
                <Route path="/upload-vacancy" element={<UploadVacancyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
