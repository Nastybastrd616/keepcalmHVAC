import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';

export const useInvoiceStore = defineStore('invoices', {
  state: () => ({
    invoices: [],
    loading: false,
    error: null,
    currentInvoice: null,
    filters: {
      status: 'all',
      dateRange: null
    }
  }),
  
  getters: {
    getInvoiceById: (state) => (id) => {
      return state.invoices.find(invoice => invoice.id === id);
    },
    
    filteredInvoices: (state) => {
      if (state.filters.status === 'all') {
        return state.invoices;
      }
      
      return state.invoices.filter(invoice => invoice.status === state.filters.status);
    },
    
    overdueInvoices: (state) => {
      const today = new Date();
      return state.invoices.filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        return dueDate < today && invoice.status !== 'PAID';
      });
    }
  },
  
  actions: {
    async fetchInvoices(locationId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/invoices`, {
          params: { locationId }
        });
        this.invoices = response.data.invoices || [];
      } catch (error) {
        console.error('Error fetching invoices:', error);
        this.error = error.message || 'Failed to fetch invoices';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchInvoice(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/invoices/${id}`);
        this.currentInvoice = response.data.invoice;
        return this.currentInvoice;
      } catch (error) {
        console.error(`Error fetching invoice ${id}:`, error);
        this.error = error.message || 'Failed to fetch invoice';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createInvoice(invoiceData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/invoices`, invoiceData);
        const newInvoice = response.data.invoice;
        this.invoices.push(newInvoice);
        return newInvoice;
      } catch (error) {
        console.error('Error creating invoice:', error);
        this.error = error.message || 'Failed to create invoice';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateInvoice(id, invoiceData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${API_URL}/invoices/${id}`, invoiceData);
        const updatedInvoice = response.data.invoice;
        
        // Update in local state
        const index = this.invoices.findIndex(i => i.id === id);
        if (index !== -1) {
          this.invoices[index] = updatedInvoice;
        }
        
        if (this.currentInvoice && this.currentInvoice.id === id) {
          this.currentInvoice = updatedInvoice;
        }
        
        return updatedInvoice;
      } catch (error) {
        console.error(`Error updating invoice ${id}:`, error);
        this.error = error.message || 'Failed to update invoice';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteInvoice(id, version) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_URL}/invoices/${id}`, {
          params: { version }
        });
        
        // Remove from local state
        this.invoices = this.invoices.filter(i => i.id !== id);
        
        if (this.currentInvoice && this.currentInvoice.id === id) {
          this.currentInvoice = null;
        }
        
        return true;
      } catch (error) {
        console.error(`Error deleting invoice ${id}:`, error);
        this.error = error.message || 'Failed to delete invoice';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    setFilter(filterType, value) {
      this.filters[filterType] = value;
    }
  }
});
