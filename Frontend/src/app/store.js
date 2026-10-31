import { configureStore } from '@reduxjs/toolkit'
import inventoryReducer from '@/features/inventory/inventorySlice'
import authReducer from '@/features/account/authSlice'
import garageReducer from '@/features/garage/garageSlice'

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    auth: authReducer,
    garage: garageReducer,
  },
})
