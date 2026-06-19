import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import appointmentReducer from './slices/appointmentSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    appointment: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export default store;
