import { useEffect, useMemo, useState } from "react";
import { createApp, deleteApp, fetchApps, updateApp } from "./api";
import "./App.css";

const STATUSES = ["Applied", "Screen", "Interview", "Offer", "Rejected"];
const WORK_MODES = ["Remote", "Hybrid", "Onsite"];

function Field({ label, children }) {
  return (
    <label className="field">
      <div className="label">{label}</div>
      {children}
    </label>
  );
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [filters, setFilters] = useState({ q: "", status: "", city: "" });

  const [form, setForm] = useState({
    company: "",
    role_title: "",
    city: "",
    work_mode: "Hybrid",
    status: "Applied",
    date_applied: "",
    job_link: "",
    notes: "",
  });

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await fetchApps({
        q: filters.q || undefined,
        status: filters.status || undefined,
        city: filters.city || undefined,
      });
      setRows(data);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueCities = useMemo(() => {
    const s = new Set(rows.map((r) => r.city).filter(Boolean));
    return Array.from(s).sort();
  }, [rows]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.company.trim() || !form.role_title.trim()) {
      setErr("Company and Role Title are required.");
      return;
    }

    const payload = {
      ...form,
      city: form.city || null,
      job_link: form.job_link || null,
      notes: form.notes || null,
      date_applied: form.date_applied || null,
    };

    try {
      await createApp(payload);
      setForm({
        company: "",
        role_title: "",
        city: "",
        work_mode: "Hybrid",
        status: "Applied",
        date_applied: "",
        job_link: "",
        notes: "",
      });
      await load();
    } catch (e2) {
      setErr(e2.message || "Error");
    }
  }

  async function quickStatus(id, status) {
    setErr("");
    try {
      await updateApp(id, { status });
      await load();
    } catch (e) {
      setErr(e.message || "Error");
    }
  }

  async function onDelete(id) {
    setErr("");
    try {
      await deleteApp(id);
      await load();
    } catch (e) {
      setErr(e.message || "Error");
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Job Application Tracker</h1>
          <p className="sub">Local-only • FastAPI + React + SQLite</p>
        </div>

        <div className="filters">
          <input
            className="input"
            placeholder="Search company / role / city…"
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />
          <select
            className="input"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={filters.city}
            onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          >
            <option value="">All cities</option>
            {uniqueCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Apply filters"}
          </button>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Add application</h2>
          <form onSubmit={onSubmit} className="form">
            <div className="row2">
              <Field label="Company *">
                <input
                  className="input"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                />
              </Field>

              <Field label="Role Title *">
                <input
                  className="input"
                  value={form.role_title}
                  onChange={(e) => setForm((p) => ({ ...p, role_title: e.target.value }))}
                />
              </Field>
            </div>

            <div className="row3">
              <Field label="City">
                <input
                  className="input"
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                />
              </Field>

              <Field label="Work mode">
                <select
                  className="input"
                  value={form.work_mode}
                  onChange={(e) => setForm((p) => ({ ...p, work_mode: e.target.value }))}
                >
                  {WORK_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="row2">
              <Field label="Date applied">
                <input
                  className="input"
                  type="date"
                  value={form.date_applied}
                  onChange={(e) => setForm((p) => ({ ...p, date_applied: e.target.value }))}
                />
              </Field>

              <Field label="Job link">
                <input
                  className="input"
                  value={form.job_link}
                  onChange={(e) => setForm((p) => ({ ...p, job_link: e.target.value }))}
                  placeholder="https://…"
                />
              </Field>
            </div>

            <Field label="Notes">
              <textarea
                className="input"
                rows={4}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </Field>

            <button className="btn primary" type="submit">
              Add
            </button>

            {err ? <div className="error">{err}</div> : null}
          </form>
        </section>

        <section className="card">
          <h2>Applications</h2>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>City</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="strong">{r.company}</td>
                    <td>{r.role_title}</td>
                    <td>{r.city || "—"}</td>
                    <td>{r.work_mode}</td>
                    <td>
                      <span className={`pill ${r.status}`}>{r.status}</span>
                    </td>
                    <td>{r.date_applied || "—"}</td>
                    <td className="actions">
                      <select
                        className="input mini"
                        value={r.status}
                        onChange={(e) => quickStatus(r.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button className="btn danger" onClick={() => onDelete(r.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty">
                      No applications yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
