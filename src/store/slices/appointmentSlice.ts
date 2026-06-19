import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    bookAppointment: (state, action: PayloadAction<Omit<Appointment, 'id' | 'status'>>) => {
      const newAppointment: Appointment = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        status: 'confirmed', // Auto-confirm in this demo template
      };
      state.appointments.push(newAppointment);
    },
    cancelAppointment: (state, action: PayloadAction<string>) => {
      const appointment = state.appointments.find(app => app.id === action.payload);
      if (appointment) {
        appointment.status = 'cancelled';
      }
    },
  },
});

export const { bookAppointment, cancelAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;
