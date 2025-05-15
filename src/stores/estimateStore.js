import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';

export const useEstimateStore = defineStore('estimates', {
  state: () => ({
    estimates: [],
    loading: false,
    error: null,
    currentEstimate: null
  }),
  
  getters: {
    getEstimateById: (state) => (id) => {
      return state.estimates.find(estimate => estimate.id === id);
    }
  },
  
  actions: {
    async fetchEstimates() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/estimates`);
        this.estimates = response.data.objects || [];
      } catch (error) {
        console.error('Error fetching estimates:', error);
        this.error = error.message || 'Failed to fetch estimates';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchEstimate(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/estimates/${id}`);
        this.currentEstimate = response.data.object;
        return this.currentEstimate;
      } catch (error) {
        console.error(`Error fetching estimate ${id}:`, error);
        this.error = error.message || 'Failed to fetch estimate';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createEstimate(estimateData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/estimates`, estimateData);
        const newEstimate = response.data.object;
        this.estimates.push(newEstimate);
        return newEstimate;
      } catch (error) {
        console.error('Error creating estimate:', error);
        this.error = error.message || 'Failed to create estimate';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateEstimate(id, estimateData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${API_URL}/estimates/${id}`, estimateData);
        const updatedEstimate = response.data.object;
        
        // Update in local state
        const index = this.estimates.findIndex(e => e.id === id);
        if (index !== -1) {
          this.estimates[index] = updatedEstimate;
        }
        
        if (this.currentEstimate && this.currentEstimate.id === id) {
          this.currentEstimate = updatedEstimate;
        }
        
        return updatedEstimate;
      } catch (error) {
        console.error(`Error updating estimate ${id}:`, error);
        this.error = error.message || 'Failed to update estimate';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteEstimate(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_URL}/estimates/${id}`);
        
        // Remove from local state
        this.estimates = this.estimates.filter(e => e.id !== id);
        
        if (this.currentEstimate && this.currentEstimate.id === id) {
          this.currentEstimate = null;
        }
        
        return true;
      } catch (error) {
        console.error(`Error deleting estimate ${id}:`, error);
        this.error = error.message || 'Failed to delete estimate';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async convertToInvoice(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/estimates/${id}/convert`);
        return response.data;
      } catch (error) {
        console.error(`Error converting estimate ${id} to invoice:`, error);
        this.error = error.message || 'Failed to convert estimate to invoice';
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});
