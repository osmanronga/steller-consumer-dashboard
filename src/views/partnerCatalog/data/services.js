import axios from '@/libs/axios'

class DataService {

  getAll(page, query) {
    if (query !== undefined) {
      return axios.get(`/Product/partnerBrands?PageNumber=${page}&query=${query}`);
    } else {
      return axios.get(`/Product/partnerBrands?PageNumber=${page}`);
    }
  }

  get(product_id) {
    return axios.get(`/Product/partnerProductDetails/${product_id}`);
  }
 
  getProducts(page = 1, pageSize = 25, search = '') {
    const params = {
      PageNumber: page,
      PageSize: pageSize,
    };

    if (search) {
      params.search = search;
    }

    return axios.get('/Product/gitListProducts', { params });
  }

  create(data) {
    return axios.post("/DashboardProduct/addPricingToProductsPartner", data);
  }

  getPartnerProductDetailsById(productId) {
    return axios.get(`/Product/partnerProductDetailsByID/${productId}`);
  }

  updateProductRates(productId, data) {
    return axios.put(`/DashboardProduct/${productId}`, data);
  }

  deleteProduct(productId) {
    return axios.delete(`/DashboardProduct/${productId}`);
  }
}
export default new DataService();