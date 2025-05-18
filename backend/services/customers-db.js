const path = require('path');
const fs = require('fs');

const CUSTOMERS_PATH = path.join(__dirname, '../data/customers.json');

function getCustomers() {
  const raw = fs.readFileSync(CUSTOMERS_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveCustomers(customers) {
  fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify(customers, null, 2), 'utf-8');
}

function addCustomer(customer) {
  const customers = getCustomers();
  customers.push({ ...customer, createdAt: new Date().toISOString() });
  saveCustomers(customers);
  return customer;
}

function updateCustomer(id, updates) {
  const customers = getCustomers();
  const idx = customers.findIndex(c => c.id === id);
  if (idx !== -1) {
    customers[idx] = { ...customers[idx], ...updates, updatedAt: new Date().toISOString() };
    saveCustomers(customers);
    return customers[idx];
  }
  return null;
}

function deleteCustomer(id) {
  let customers = getCustomers();
  customers = customers.filter(c => c.id !== id);
  saveCustomers(customers);
  return true;
}

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
};
