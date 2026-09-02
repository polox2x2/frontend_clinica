import api from '../../../services/api';

const RESOURCE = '/schedules';

export const scheduleService = {
  getAll: async () => {
    const response = await api.get(RESOURCE);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`${RESOURCE}/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post(RESOURCE, data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`${RESOURCE}/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`${RESOURCE}/${id}`);
    return response.data;
  }
};
