import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';

export const useCustomerStore = defineStore('customers', {
  state: () => ({
    customers: [],
    loading: false,
    error: null,
    currentCustomer: null
  }),
  
  getters: {
    getCustomerById: (state) => (id) => {
      return state.customers.find(customer => customer.id === id);
    }
  },
  
  actions: {
    async fetchCustomers() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/customers`);
        this.customers = response.data.customers || [];
      } catch (error) {
        console.error('Error fetching customers:', error);
        this.error = error.message || 'Failed to fetch customers';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCustomer(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/customers/${id}`);
        this.currentCustomer = response.data.customer;
        return this.currentCustomer;
      } catch (error) {
        console.error(`Error fetching customer ${id}:`, error);
        this.error = error.message || 'Failed to fetch customer';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createCustomer(customerData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/customers`, customerData);
        const newCustomer = response.data.customer;
        this.customers.push(newCustomer);
        return newCustomer;
      } catch (error) {
        console.error('Error creating customer:', error);
        this.error = error.message || 'Failed to create customer';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateCustomer(id, customerData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${API_URL}/customers/${id}`, customerData);
        const updatedCustomer = response.data.customer;
        
        // Update in local state
        const index = this.customers.findIndex(c => c.id === id);
        if (index !== -1) {
          this.customers[index] = updatedCustomer;
        }
        
        if (this.currentCustomer && this.currentCustomer.id === id) {
          this.currentCustomer = updatedCustomer;
        }
        
        return updatedCustomer;
      } catch (error) {
        console.error(`Error updating customer ${id}:`, error);
        this.error = error.message || 'Failed to update customer';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteCustomer(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_URL}/customers/${id}`);
        
        // Remove from local state
        this.customers = this.customers.filter(c => c.id !== id);
        
        if (this.currentCustomer && this.currentCustomer.id === id) {
          this.currentCustomer = null;
        }
        
        return true;
      } catch (error) {
        console.error(`Error deleting customer ${id}:`, error);
        this.error = error.message || 'Failed to delete customer';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
