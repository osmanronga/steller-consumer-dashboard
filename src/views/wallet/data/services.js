import axios from '@/libs/axios'

class WalletService {
  // Get all wallets in the system
  async getAllWallets() {
    try {
      const response = await axios.get('/Wallet')
      if (response.data.status) {
        return response.data.data
      }
      return []
    } catch (error) {
      console.error('Error fetching all wallets:', error)
      throw error
    }
  }

  // Get specific wallet by wallet number
  async getWalletByNumber() {
    try {
      const response = await axios.get(`/Wallet`)
      if (response.data.status) {
        return response.data.data
      }
      throw new Error('Wallet not found')
    } catch (error) {
      console.error('Error fetching wallet by number:', error)
      throw error
    }
  }

  async getWalletBalance(){
    try {
      const response = await axios.get(`/Wallet/available-balance`)
      if (response.data.status) {
        return response.data.data
      }
      throw new Error('Wallet not found')
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      throw error
    }
  }

  // Get specific wallet by partner ID
  async getWalletByPartnerId(partnerId) {
    try {
      const response = await axios.get(`/Wallet/info`)
      if (response.data.status) {
        return response.data.data
      }
      throw new Error('Wallet not found')
    } catch (error) {
      console.error('Error fetching wallet by partner ID:', error)
      throw error
    }
  }

  // Get wallet history by wallet number
  async getWalletHistory(walletNumber) {
    try {
      const response = await axios.get(`/Wallet/history`)
      if (response.data.status) {
        return response.data.data
      }
      return []
    } catch (error) {
      console.error('Error fetching wallet history:', error)
      throw error
    }
  }


  

  // Get wallet info including partner details
  async getWalletInfo() {
    try {
      const response = await axios.get(`/Wallet/info`)
      if (response.data.status) {
        return response.data.data
      }
      throw new Error('Failed to get wallet info')
    } catch (error) {
      console.error('Error fetching wallet info:', error)
      throw error
    }
  }
}

export default new WalletService() 