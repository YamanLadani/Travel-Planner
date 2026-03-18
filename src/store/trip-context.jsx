import React, { createContext, useContext, useReducer } from 'react'

const TripContext = createContext()

const initialState = {
  trips: [],
  currentTrip: null,
}

const tripReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] }
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload }
    default:
      return state
  }
}

export const TripProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tripReducer, initialState)

  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  )
}

export const useTrip = () => {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}