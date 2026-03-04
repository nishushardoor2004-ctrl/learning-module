import api from './api';

export const lessonService = {
  getLessonById: async (id) => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  getSectionsByCourse: async (courseId) => {
    const response = await api.get(`/sections/course/${courseId}`);
    return response.data;
  },

  createLesson: async (lessonData) => {
    const response = await api.post('/lessons', lessonData);
    return response.data;
  },

  updateLesson: async (id, lessonData) => {
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data;
  },

  deleteLesson: async (id) => {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  }
};
