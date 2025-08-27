import axios from '@/libs/axios'

class DataService {

  getAll(page,query) {
    if (query !== undefined) {
      return axios.get(`/Partner?PageNumber=${page}&query=${query}`);
    }else{
      return axios.get(`/Partner?PageNumber=${page}`);
    }
  }

  get(id) {
    return axios.get(`/Partner/${id}`);
  }

  create(data) {
    return axios.post("/Partner/createdPartner", data);
  }

  createUserForPartner(data) {
    return axios.post("/Partner/AddUserForPartner", data);
  }

  update(id, data) {
    return axios.put(`/Partner/${id}`, data);
  }

  delete(id) {
    return axios.delete(`/Partner/${id}`);
  }

 
 
}
export default new DataService();