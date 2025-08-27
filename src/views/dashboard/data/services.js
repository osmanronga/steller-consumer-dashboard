import axios from '@/libs/axios'
import { mockStats, mockActivities, mockSalesData, mockUserData } from './mockData'


const DashboardService = {
  // Get all dashboard statistics
  async getDashboardStats() {
    const response = await axios.get(`/Dashboard`)
    const { data } = response.data
    return {
      numberOfSuccecedOrders: data.stats.numberOfSuccecedOrders,
      numberOfOrders: data.stats.numberOfOrders,
      totalPartners: data.stats.totalPartners,
      totalOrders: data.stats.totalOrders,
      totalRevenue: data.stats.totalRevenue
    }
  },

  // Get recent activities
  async getRecentActivities() {
    const response = await axios.get(`/Dashboard`)
    const { orderActivities, userActivities } = response.data.data.activities
    
    // Combine and sort activities by timestamp
    const allActivities = [
      ...orderActivities.map(activity => ({
        type: 'order',
        description: activity.activityType,
        status: activity.status,
        timestamp: activity.timestamp,
        timeAgo: activity.timeAgo
      })),
      ...userActivities.map(activity => ({
        type: 'user',
        description: activity.activityType,
        status: activity.status,
        timestamp: activity.timestamp,
        timeAgo: activity.timeAgo
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    return allActivities
  },

  // Get sales statistics
  async getSalesStats() {
    const response = await axios.get(`/Dashboard`)
    return response.data.data.salesStatistics.map(stat => ({
      date: new Date(stat.date).toLocaleDateString(),
      amount: stat.amount
    }))
  },

  // Get user statistics
  async getUserStats() {
    const response = await axios.get(`/Dashboard`)
    const { userStatistics } = response.data.data
    return [
      { label: 'Admins', value: userStatistics.adminCount },
      { label: 'Partners', value: userStatistics.partnerAdminCount }
    ]
  },

  // Get order statistics
  getOrderStats() {
    return axios.get('/dashboard/orders')
  }
}

export default DashboardService