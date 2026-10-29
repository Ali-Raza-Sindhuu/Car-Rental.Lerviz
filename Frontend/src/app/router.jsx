import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import HomePage from '@/features/home/HomePage'
import InventoryPage from '@/features/inventory/InventoryPage'
import CarDetailsPage from '@/features/car-details/CarDetailsPage'
import ContactPage from '@/features/contact/ContactPage'
import AccountPage from '@/features/account/AccountPage'
import NotFoundPage from '@/features/not-found/NotFoundPage'

// Replace these temporary route elements as pages are created.
const temporaryPage = <main>LuxAuto frontend setup complete.</main>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'inventory/:id', element: <CarDetailsPage /> },
      { path: 'about', element: temporaryPage },
      { path: 'services', element: temporaryPage },
      { path: 'contact', element: <ContactPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
