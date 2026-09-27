import api from './api';

const classService = {
  getAll: () => api.get('/classes'),
  getSubjects: (classId) => api.get(`/subjects/class/${classId}`),
  getChapters: (subjectId) => api.get(`/chapters/subject/${subjectId}`),
  getQuestions: (chapterId) => api.get(`/questions/chapter/${chapterId}`),
};

export default classService;
