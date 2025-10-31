import { useState, useEffect } from 'react';
import { saveJob, getAllJobs } from './data/jobStore';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const allJobs = await getAllJobs();
      setJobs(allJobs);
    };
    fetchJobs();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (newJob.trim() === '') return;

    await saveJob({ description: newJob, status: 'Lokalny' });
    setNewJob('');
    const allJobs = await getAllJobs();
    setJobs(allJobs);
  };

  return (
    <>
      <h1>PWA Fachowiec</h1>
      <div className="card">
        <h2>Nowe Zlecenie</h2>
        <form onSubmit={handleAddJob}>
          <input
            type="text"
            value={newJob}
            onChange={(e) => setNewJob(e.target.value)}
            placeholder="Opis zlecenia"
          />
          <button type="submit">Dodaj Zlecenie</button>
        </form>
      </div>
      <div className="card">
        <h2>Lista Zleceń</h2>
        <ul>
          {jobs.map(job => (
            <li key={job.id}>
              {job.description} - <strong>{job.status}</strong>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
