import axios from '@axios'

export default {
  getAllByPartnerId(partnerId, page = 1) {
    return axios.get(`/Account/partner/${partnerId}?page=${page}`)
  },


  get(id) {
    return axios.get(`/Account/${id}`);
  },

  create(data) {
    return axios.post("/Account/Register", data);
  },

  update(id, data) {
    return axios.put(`/Account/${id}`, data);
  },

  delete(id) {
    return axios.delete(`/Account/${id}`);
  },
} 