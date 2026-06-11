import { useEffect, useState } from 'react';
import { api } from '../api';

const initialForm = { name: '', phone: '', dob: '', notes: '' };

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadPatients = async (searchText = '') => {
    try {
      const data = await api.getPatients(searchText);
      setPatients(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.updatePatient(editingId, form);
      } else {
        await api.addPatient(form);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadPatients(search);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const startEdit = (patient) => {
    setEditingId(patient.id);
    setForm({
      name: patient.name,
      phone: patient.phone,
      dob: patient.dob,
      notes: patient.notes || '',
    });
  };

  const removePatient = async (id) => {
    const confirmed = window.confirm('Delete this patient and all their appointments?');
    if (!confirmed) {
      return;
    }

    try {
      await api.deletePatient(id);
      await loadPatients(search);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await loadPatients(search);
  };

  return (
    <section>
      <h2>Patients</h2>

      <div className="mini-kpis">
        <span className="kpi-chip">Total Patients: {patients.length}</span>
        {search ? <span className="kpi-chip">Search: {search}</span> : null}
      </div>

      <div className="card">
        <h3>{editingId ? 'Edit Patient' : 'Add Patient'}</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Phone Number
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              required
            />
          </label>
          <label>
            Date of Birth
            <input
              type="date"
              value={form.dob}
              onChange={(event) => setForm({ ...form, dob: event.target.value })}
              required
            />
          </label>
          <label className="full-width">
            Notes
            <textarea
              rows="3"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </label>

          <div className="button-row full-width">
            <button type="submit" className="primary-btn">
              {editingId ? 'Update Patient' : 'Add Patient'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="card">
        <form className="search-row" onSubmit={handleSearch}>
          <input
            placeholder="Search by name or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit" className="secondary-btn">
            Search
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.phone}</td>
                <td>{patient.dob}</td>
                <td>{patient.notes}</td>
                <td className="button-row">
                  <button type="button" className="small-btn" onClick={() => startEdit(patient)}>
                    Edit
                  </button>
                  <button type="button" className="small-btn danger" onClick={() => removePatient(patient.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 ? (
              <tr>
                <td colSpan="5">No patients found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PatientsPage;
