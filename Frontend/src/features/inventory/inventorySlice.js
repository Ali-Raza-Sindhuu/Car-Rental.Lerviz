import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  vehicles: [
    {
      id: 'mercedes-s-class',
      brand: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2025,
      price: 120000,
    },
    {
      id: 'bmw-7-series',
      brand: 'BMW',
      model: '7 Series',
      year: 2025,
      price: 98000,
    },
    {
      id: 'porsche-911',
      brand: 'Porsche',
      model: '911 Carrera',
      year: 2025,
      price: 125000,
    },
  ],
  brandFilter: 'all',
  searchQuery: '',
  sortBy: 'default',
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setVehicles: (state, action) => {
      state.vehicles = action.payload
    },
    setBrandFilter: (state, action) => {
      state.brandFilter = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
  },
})

export const {
  setVehicles,
  setBrandFilter,
  setSearchQuery,
  setSortBy,
} = inventorySlice.actions
export default inventorySlice.reducer
