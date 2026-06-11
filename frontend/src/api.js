const API_BASE_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getPatients: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/patients${query}`);
  },
  seedDemoData: () => request('/patients/seed-demo', { method: 'POST' }),
  addPatient: (payload) => request('/patients', { method: 'POST', body: JSON.stringify(payload) }),
  updatePatient: (id, payload) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePatient: (id) => request(`/patients/${id}`, { method: 'DELETE' }),
  getTodayAppointments: () => request('/appointments/today'),
  getAppointmentsByDate: (date) => request(`/appointments?date=${encodeURIComponent(date)}`),
  createAppointment: (payload) => request('/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  updateAppointmentStatus: (id, status) =>
    request(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getTodayQueue: () => request('/queue/today'),
  getDailyReport: (date) => request(`/reports/daily?date=${encodeURIComponent(date)}`),
};
