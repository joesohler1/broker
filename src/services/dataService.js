/**
 * Data Service Configuration
 * Easy toggle between local development and production API
 */

import localDataService from './localDataService';
import apiService from './apiService';

// Toggle this for development vs production
const USE_LOCAL_DATA = true;

// Export the active data service
const dataService = USE_LOCAL_DATA ? localDataService : apiService;

export default dataService;

// This allows you to easily switch by changing one line:
// const USE_LOCAL_DATA = false; // Switch to real API