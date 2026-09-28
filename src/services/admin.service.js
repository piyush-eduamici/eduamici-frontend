import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

adminApi.interceptors.request.use((config) => {
  const pwd = sessionStorage.getItem('admin_password');
  if (pwd) config.headers['x-admin-password'] = pwd;
  return config;
});

adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(new Error(error.response?.data?.message || error.message))
);

const adminService = {
  verify: (password) => adminApi.post('/admin/verify', { password }),
  getChapters: () => adminApi.get('/admin/chapters'),
  addQuestion: (data) => adminApi.post('/admin/questions', data),
  getQuestions: () => adminApi.get('/admin/questions'),
  deleteQuestion: (id) => adminApi.delete('/admin/questions/' + id),
  addNote: (data) => adminApi.post('/notes', data),
  getNotes: () => adminApi.get('/notes'),
  deleteNote: (id) => adminApi.delete('/notes/' + id),
  addLecture: (data) => adminApi.post('/lectures', data),
  getLectures: () => adminApi.get('/lectures'),
  deleteLecture: (id) => adminApi.delete('/lectures/' + id),
  getBoards: () => adminApi.get('/content/boards'),
  getClassesAll: () => adminApi.get('/content/classes-all'),
  getClassesByBoard: (boardId) => adminApi.get('/content/classes-by-board/' + boardId),
  getSubjectsAll: () => adminApi.get('/content/subjects-all'),
  getSubjectsByClass: (classId) => adminApi.get('/content/subjects-by-class/' + classId),
  getChaptersAll: () => adminApi.get('/content/chapters-all'),
  getChaptersBySubject: (subjectId) => adminApi.get('/content/chapters-by-subject/' + subjectId),
  addBoard: (data) => adminApi.post('/content/boards', data),
  addClass: (data) => adminApi.post('/content/classes', data),
  addSubject: (data) => adminApi.post('/content/subjects', data),
  addChapter: (data) => adminApi.post('/content/chapters', data),
  deleteBoard: (id) => adminApi.delete('/content/boards/' + id),
  deleteClass: (id) => adminApi.delete('/content/classes/' + id),
  deleteSubject: (id) => adminApi.delete('/content/subjects/' + id),
  deleteChapter: (id) => adminApi.delete('/content/chapters/' + id),
  getTests: () => adminApi.get('/tests'),
  createTest: (data) => adminApi.post('/tests', data),
};

export default adminService;
