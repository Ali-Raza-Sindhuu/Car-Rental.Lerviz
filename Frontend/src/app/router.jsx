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
import ProfilePage from '@/features/account/ProfilePage'
import ProtectedRoute from '@/features/account/ProtectedRoute'
import AboutPage from '@/features/about/AboutPage'
import ServicesPage from '@/features/services/ServicesPage'
import NotFoundPage from '@/features/not-found/NotFoundPage'
import RouteErrorPage from '@/features/not-found/RouteErrorPage'
import GaragePage from '@/features/garage/GaragePage'
import CheckoutPage from '@/features/garage/CheckoutPage'
import CheckoutSuccessPage from '@/features/garage/CheckoutSuccessPage'
import SavedCarsPage from '@/features/inventory/SavedCarsPage'

const AuthTitle = ({ title, children }) => {
  useEffect(() => { document.title = `${title} | REVEX` }, [title])
  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'inventory/:id', element: <CarDetailsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'saved', element: <SavedCarsPage /> },
      { path: 'cart', element: <GaragePage /> },
      { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: 'checkout/success', element: <CheckoutSuccessPage /> },
      { path: 'account', element: <Navigate to="/login" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/login', element: <AuthTitle title="Log in"><LoginPage /></AuthTitle> },
  { path: '/signup', element: <AuthTitle title="Sign up"><SignUpPage /></AuthTitle> },
  { path: '/forgot-password', element: <AuthTitle title="Forgot password"><ForgotPasswordPage /></AuthTitle> },
  { path: '/reset-password', element: <AuthTitle title="Reset password"><ResetPasswordPage /></AuthTitle> },
  { path: '/verify-email', element: <AuthTitle title="Verify email"><VerifyEmailPage /></AuthTitle> },
])
import { useEffect } from 'react'
