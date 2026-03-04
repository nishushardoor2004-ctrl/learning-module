import api from './api';

export const enrollmentService = {
  enrollInCourse: async (courseId) => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },

  checkEnrollmentStatus: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}/status`);
    return response.data;
  },

  unenrollFromCourse: async (courseId) => {
    const response = await api.delete(`/enrollments/${courseId}`);
    return response.data;
  }
};
