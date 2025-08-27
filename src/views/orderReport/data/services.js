import axios from '@/libs/axios'


class OrderReportService {
  // Get all orders with optional filters
  getAll(page = 1, searchQuery = '', status = '', date = '') {
    let url = `/Order?PageNumber=${page}`
    
    // Add search query if provided
    if (searchQuery && searchQuery.trim()) {
      url += `&query=${encodeURIComponent(searchQuery.trim())}`
    }
    
    
    
    // Add status filter if provided
    if (status) {
      url += `&status=${status}`
    }
    
    // Add date filter if provided
    if (date) {
      url += `&date=${date}`
    }
    
    return axios.get(url)
  }

  // Get orders with new API structure
  getOrders(page = 1,  status = '', startDate = '', endDate = '',  orderStatusId = null) {
    let url = `/Order?PageNumber=${page}`
    
    // Add status filter if provided
    if (status) {
      url += `&status=${status}`
    }
    
    // Add order status ID filter if provided
    if (orderStatusId) {
      url += `&orderStatusId=${orderStatusId}`
    }
    
    // Add start date filter if provided
    if (startDate) {
      url += `&startDate=${startDate}`
    }
    
    // Add end date filter if provided
    if (endDate) {
      url += `&endDate=${endDate}`
    }
    
    return axios.get(url)
  }

  // Get order details by request ID
  getByRequestId(requestId) {
    return axios.get(`/Order/${requestId}`)
  }

 

  // Export orders (for download functionality)
  exportOrders(filters = {}) {
    return axios.get('/OrderReport/export', {
      params: filters,
      responseType: 'blob'
    })
  }

  // Get order statistics
  getOrderStats() {
    return axios.get('/OrderReport/stats')
  }

  // Get order by order ID (if available)
  getByOrderId(orderId) {
    return axios.get(`/OrderReport/order/${orderId}`)
  }

  
}

export default new OrderReportService() 