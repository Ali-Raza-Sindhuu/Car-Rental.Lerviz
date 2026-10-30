import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import HomePage from '@/features/home/HomePage'
import InventoryPage from '@/features/inventory/InventoryPage'
import CarDetailsPage from '@/features/inventory/details/CarDetailsPage'
import ContactPage from '@/features/contact/ContactPage'
import LoginPage from '@/features/account/LoginPage'
import SignUpPage from '@/features/account/SignUpPage'
import ForgotPasswordPage from '@/features/account/ForgotPasswordPage'
import ResetPasswordPage from '@/features/account/ResetPasswordPage'
import VerifyEmailPage from '@/features/account/VerifyEmailPage'
import AboutPage from '@/features/about/AboutPage'
import ServicesPage from '@/features/services/ServicesPage'
import NotFoundPage from '@/features/not-found/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'inventory/:id', element: <CarDetailsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'account', element: <Navigate to="/login" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
])
