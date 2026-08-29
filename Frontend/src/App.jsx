import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-ink text-white font-body overflow-x-hidden">
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/inventory"
            element={
              <PageWrapper>
                <Placeholder title="Inventory" />
              </PageWrapper>
            }
          />
          <Route
            path="/inventory/:slug"
            element={
              <PageWrapper>
                <Placeholder title="Vehicle Details" />
              </PageWrapper>
            }
          />
          <Route
            path="/blogs"
            element={
              <PageWrapper>
                <Placeholder title="Blogs" />
              </PageWrapper>
            }
          />
          <Route
            path="/blogs/:slug"
            element={
              <PageWrapper>
                <Placeholder title="Article" />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <Placeholder title="Contact" />
              </PageWrapper>
            }
          />
          <Route
            path="/legal/privacy-policy"
            element={
              <PageWrapper>
                <Placeholder title="Privacy Policy" />
              </PageWrapper>
            }
          />
          <Route
            path="/legal/terms-conditions"
            element={
              <PageWrapper>
                <Placeholder title="Terms & Conditions" />
              </PageWrapper>
            }
          />
          <Route
            path="*"
            element={
              <PageWrapper>
                <Placeholder title="404 — Page Not Found" />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
