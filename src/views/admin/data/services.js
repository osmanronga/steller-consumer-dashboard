import axios from '@/libs/axios'

class DataService {
  getAll(page,query) {
    if (query !== undefined) {
      return axios.get(`/Account?query=${query}`);
    }
    else{
      return axios.get(`/Account?PageNumber=${page}`);
    }
    
  }
  get(id) {
    return axios.get(`/Account/${id}`);
  }

  create(data) {
    return axios.post("/Account/Register", data);
  }

  update(id, data) {
    return axios.put(`/Account/${id}`, data);
  }

  delete(id) {
    return axios.delete(`/Account/${id}`);
  }

  changePassword(id) {
    return axios.get(`/changePassword/${id}`);
  }

  
}
export default new DataService();