import axios from '@/libs/axios'

class DataService {
  getAll(page) {
      return axios.get(`/PartnerPersonContact?PageNumber=${page}`);
  }

  getContacsByPartnerId(partnerId, page) {
      return axios.get(`/PartnerPersonContact/PartnerPersonContactByPartnerId/${partnerId}?PageNumber=${page}`);
  }

  get(id) {
    return axios.get(`/PartnerPersonContact/${id}`);
  }

  create(data) {
    return axios.post("/PartnerPersonContact/addPartnerContact", data);
  }

  update(id, data) {
    return axios.put(`/PartnerPersonContact/${id}`, data);
  }

  delete(id) {
    return axios.delete(`/PartnerPersonContact/${id}`);
  }

  getPartners() {
    return axios.get(`/Partner/PartnerLockUp`);
  }

  
}
export default new DataService();