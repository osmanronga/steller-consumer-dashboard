import axios from '@/libs/axios'

class DataService {

  getAll(partner_id,page,query) {
    if (query !== undefined) {
      return axios.get(`/Product/paginatePartnerProducts/${partner_id}?PageNumber=${page}&query=${query}`);
    }else{
      return axios.get(`/Product/paginatePartnerProducts/${partner_id}?PageNumber=${page}`);
    }
  }

  get(partner_id,product_id) {
    return axios.get(`/Product/partnerProductDetails/${partner_id}/${product_id}`);
  }
 
  getProducts(){
    return axios.get(`/Product/gitListProducts`);
  }

  searchProducts(search) {
    return axios.get('/Product/gitListProducts', {
      params: {
        search: search
      }
    })
  }

  create(data) {
    return axios.post("/DashboardProduct/addPricingToProductsPartner", data);
  }
}
export default new DataService();