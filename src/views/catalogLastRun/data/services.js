import axios from '@/libs/axios'

class DataService {

  getAll(page,query) {
    if (query !== undefined) {
      return axios.get(`/Brand?PageNumber=${page}&query=${query}`);
    }else{
      return axios.get(`/Brand?PageNumber=${page}`);
    }
  }

  get(id) {
    return axios.get(`/Brand/getBrand/${id}`);
  }
 
}
export default new DataService();