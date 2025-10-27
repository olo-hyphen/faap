import localforage from 'localforage';

// Ustawienie IndexedDB
const jobStore = localforage.createInstance({
name: "FachowiecPWA", // Nazwa bazy danych
storeName: "zlecenia", // Nazwa magazynu (tabeli)
description: "Zlecenia i zadania klienta"
});

// FUNKCJA: Zapisywanie zlecenia (działa offline)
export async function saveJob(jobData) {
// Dodanie unikalnego ID, jeśli to nowe zlecenie
const id = jobData.id || Date.now().toString();
await jobStore.setItem(id, { ...jobData, id, status: 'Lokalny' });
// W normalnej aplikacji, tutaj dodalibyśmy do kolejki synchronizacji
return id;
}

// FUNKCJA: Pobieranie wszystkich zleceń (działa offline)
export async function getAllJobs() {
const jobs = [];
await jobStore.iterate((value, key, iterationNumber) => {
jobs.push(value);
});
return jobs;
}

// ... inne funkcje (usuń, zaktualizuj)
