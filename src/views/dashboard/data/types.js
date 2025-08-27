/**
 * @typedef {Object} DashboardStats
 * @property {number} totalSales - Total number of sales
 * @property {number} totalUsers - Total number of users
 * @property {number} totalOrders - Total number of orders
 * @property {number} totalRevenue - Total revenue
 */

/**
 * @typedef {Object} Activity
 * @property {string} id - Activity ID
 * @property {string} title - Activity title
 * @property {string} time - Activity time
 * @property {string} status - Activity status
 * @property {string} variant - Bootstrap variant for status badge
 */

/**
 * @typedef {Object} SalesData
 * @property {string} name - Series name
 * @property {Array<{x: string, y: number}>} data - Array of data points
 */

/**
 * @typedef {Object} UserStats
 * @property {number} admins - Number of admin users
 * @property {number} partners - Number of partner users
 * @property {number} customers - Number of customer users
 */

export const API_RESPONSE = {
  stats: {
    totalSales: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
  activities: [],
  sales: [],
  users: {
    admins: 0,
    partners: 0,
    customers: 0,
  },
} 