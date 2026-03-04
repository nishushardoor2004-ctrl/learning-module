import api from './api';

export const progressService = {
  markLessonComplete: async (lessonId) => {
    const response = await api.post('/progress/complete', { lessonId });
    return response.data;
  },

  updateLastWatched: async (lessonId) => {
    const response = await api.post('/progress/watch', { lessonId });
    return response.data;
  },

  getCourseProgress: async (courseId) => {
    const response = await api.get(`/progress/${courseId}`);
    return response.data;
  },

  getAllProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  }
};
