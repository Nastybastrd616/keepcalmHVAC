import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    appointments: [],
    loading: false,
    error: null,
    currentAppointment: null,
    selectedDate: new Date()
  }),
  
  getters: {
    getAppointmentById: (state) => (id) => {
      return state.appointments.find(appointment => appointment.id === id);
    },
    
    appointmentsByDate: (state) => (date) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return state.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.startTime);
        return appointmentDate >= startOfDay && appointmentDate <= endOfDay;
      });
    },
    
    appointmentsForSelectedDate: (state) => {
      return state.appointmentsByDate(state.selectedDate);
    },
    
    upcomingAppointments: (state) => {
      const now = new Date();
      return state.appointments
        .filter(appointment => new Date(appointment.startTime) >= now)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    }
  },
  
  actions: {
    async fetchAppointments(params = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/schedule`, { params });
        this.appointments = response.data.appointments || [];
      } catch (error) {
        console.error('Error fetching appointments:', error);
        this.error = error.message || 'Failed to fetch appointments';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchAppointment(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/schedule/${id}`);
        this.currentAppointment = response.data.appointment;
        return this.currentAppointment;
      } catch (error) {
        console.error(`Error fetching appointment ${id}:`, error);
        this.error = error.message || 'Failed to fetch appointment';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createAppointment(appointmentData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/schedule`, appointmentData);
        const newAppointment = response.data.appointment;
        this.appointments.push(newAppointment);
        return newAppointment;
      } catch (error) {
        console.error('Error creating appointment:', error);
        this.error = error.message || 'Failed to create appointment';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateAppointment(id, appointmentData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${API_URL}/schedule/${id}`, appointmentData);
        const updatedAppointment = response.data.appointment;
        
        // Update in local state
        const index = this.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
        }
        
        if (this.currentAppointment && this.currentAppointment.id === id) {
          this.currentAppointment = updatedAppointment;
        }
        
        return updatedAppointment;
      } catch (error) {
        console.error(`Error updating appointment ${id}:`, error);
        this.error = error.message || 'Failed to update appointment';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteAppointment(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_URL}/schedule/${id}`);
        
        // Remove from local state
        this.appointments = this.appointments.filter(a => a.id !== id);
        
        if (this.currentAppointment && this.currentAppointment.id === id) {
          this.currentAppointment = null;
        }
        
        return true;
      } catch (error) {
        console.error(`Error deleting appointment ${id}:`, error);
        this.error = error.message || 'Failed to delete appointment';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    setSelectedDate(date) {
      this.selectedDate = date;
    }
  }
});
