import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  UserCheck,
  Clock3,
  Plus,
  Search,
  X,
  Eye,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Trash2,
} from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";

const API_URL = "http://localhost:5000";

export default function Recruitment() {
  const [showForm, setShowForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  const [form, setForm] = useState({
    title: "",
    department: "IT",
    location: "",
    type: "Full Time",
    openings: 1,
  });

  const [candidateForm, setCandidateForm] = useState({
    name: "",
    email: "",
    position: "",
    experience: "",
    applied_date: new Date().toISOString().split("T")[0],
    stage: "Applied",
  });

  // =====================================================
  // LOAD JOBS
  // =====================================================

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);

      const response = await fetch(`${API_URL}/recruitment/jobs`);

      if (!response.ok) {
        throw new Error("Failed to load jobs");
      }

      const data = await response.json();

      const formatted = data.map((job) => ({
        id: job.id,
        title: job.position,
        department: job.department,
        location: job.location,
        type: job.employment_type,
        openings: Number(job.openings || 0),
        applicants: Number(job.applicants || 0),
        status:
          String(job.status).toLowerCase() === "closed"
            ? "Closed"
            : "Open",
      }));

      setJobs(formatted);
    } catch (error) {
      console.error("LOAD JOBS ERROR:", error);
      alert("Unable to load job openings.");
    } finally {
      setLoadingJobs(false);
    }
  };

  // =====================================================
  // LOAD CANDIDATES
  // =====================================================

  const loadCandidates = async () => {
    try {
      setLoadingCandidates(true);

      const response = await fetch(
        `${API_URL}/recruitment/candidates`
      );

      if (!response.ok) {
        throw new Error("Failed to load candidates");
      }

      const data = await response.json();

      const formatted = data.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email || "",
        position: candidate.position,
        experience: candidate.experience || "Fresher",
        applied: formatDate(candidate.applied_date),
        applied_date: candidate.applied_date,
        stage: candidate.stage || "Applied",
      }));

      setCandidates(formatted);
    } catch (error) {
      console.error("LOAD CANDIDATES ERROR:", error);
      alert("Unable to load candidates.");
    } finally {
      setLoadingCandidates(false);
    }
  };

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================

  useEffect(() => {
    loadJobs();
    loadCandidates();
  }, []);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  function formatDate(date) {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // =====================================================
  // FORM UPDATE
  // =====================================================

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateCandidateForm = (field, value) => {
    setCandidateForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =====================================================
  // CREATE JOB
  // =====================================================

  const createJob = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/recruitment/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: form.title.trim(),
          department: form.department,
          location: form.location.trim(),
          employment_type: form.type,
          openings: Number(form.openings) || 1,
          status: "Open",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create job");
      }

      setForm({
        title: "",
        department: "IT",
        location: "",
        type: "Full Time",
        openings: 1,
      });

      setShowForm(false);

      await loadJobs();
    } catch (error) {
      console.error("CREATE JOB ERROR:", error);
      alert(error.message || "Unable to create job.");
    }
  };

  // =====================================================
  // CREATE CANDIDATE
  // =====================================================

  const createCandidate = async (event) => {
    event.preventDefault();

    if (
      !candidateForm.name.trim() ||
      !candidateForm.position.trim()
    ) {
      alert("Candidate name and position are required.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/recruitment/candidates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: candidateForm.name.trim(),
            email: candidateForm.email.trim(),
            position: candidateForm.position.trim(),
            experience:
              candidateForm.experience.trim() || "Fresher",
            applied_date: candidateForm.applied_date,
            stage: candidateForm.stage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create candidate"
        );
      }

      setCandidateForm({
        name: "",
        email: "",
        position: "",
        experience: "",
        applied_date: new Date()
          .toISOString()
          .split("T")[0],
        stage: "Applied",
      });

      setShowCandidateForm(false);

      await loadCandidates();
      await loadJobs();
    } catch (error) {
      console.error("CREATE CANDIDATE ERROR:", error);
      alert(error.message || "Unable to create candidate.");
    }
  };

  // =====================================================
  // UPDATE CANDIDATE STAGE
  // =====================================================

  const updateCandidateStage = async (id, stage) => {
    try {
      const response = await fetch(
        `${API_URL}/recruitment/candidates/${id}/stage`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stage }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update candidate"
        );
      }

      await loadCandidates();
    } catch (error) {
      console.error("UPDATE STAGE ERROR:", error);
      alert(error.message || "Unable to update candidate stage.");
    }
  };

  // =====================================================
  // DELETE CANDIDATE
  // =====================================================

  const deleteCandidate = async (id) => {
    if (!window.confirm("Delete this candidate?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/recruitment/candidates/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete candidate"
        );
      }

      await loadCandidates();
      await loadJobs();
    } catch (error) {
      console.error("DELETE CANDIDATE ERROR:", error);
      alert(error.message || "Unable to delete candidate.");
    }
  };

  // =====================================================
  // DELETE JOB
  // =====================================================

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job opening?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/recruitment/jobs/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete job"
        );
      }

      await loadJobs();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);
      alert(error.message || "Unable to delete job.");
    }
  };

  // =====================================================
  // FILTER CANDIDATES
  // =====================================================

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.position.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query);

      const matchesStage =
        statusFilter === "All" ||
        candidate.stage === statusFilter;

      return matchesSearch && matchesStage;
    });
  }, [candidates, search, statusFilter]);

  // =====================================================
  // REAL DATABASE STATS
  // =====================================================

  const openJobs = jobs.filter(
    (job) => job.status === "Open"
  ).length;

  const totalApplicants = candidates.length;

  const interviews = candidates.filter(
    (candidate) => candidate.stage === "Interview"
  ).length;

  const hired = candidates.filter(
    (candidate) => candidate.stage === "Hired"
  ).length;

  return (
    <AppLayout title="Recruitment">
      <div className="max-w-[1600px] mx-auto">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Recruitment
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage job openings, candidates and hiring activities.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => setShowCandidateForm(true)}
              className="btn-secondary"
            >
              <Users size={17} />
              Add Candidate
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus size={17} />
              Create Job Opening
            </button>

          </div>

        </div>

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          <SummaryCard
            icon={<BriefcaseBusiness size={19} />}
            title="Open Positions"
            value={openJobs}
            color="blue"
          />

          <SummaryCard
            icon={<Users size={19} />}
            title="Total Applicants"
            value={totalApplicants}
            color="purple"
          />

          <SummaryCard
            icon={<Clock3 size={19} />}
            title="Interviews"
            value={interviews}
            color="amber"
          />

          <SummaryCard
            icon={<UserCheck size={19} />}
            title="Hired"
            value={hired}
            color="green"
          />

        </div>

        {/* =====================================================
            CREATE JOB FORM
        ====================================================== */}

        {showForm && (
          <div className="surface-card p-5 mb-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Create Job Opening
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Add a new position to the recruitment pipeline.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={createJob}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Job Title *
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    updateForm("title", e.target.value)
                  }
                  placeholder="e.g. Software Developer"
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Department
                </label>

                <select
                  value={form.department}
                  onChange={(e) =>
                    updateForm("department", e.target.value)
                  }
                  className="input-field mt-1"
                >
                  <option>IT</option>
                  <option>Human Resources</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>Operations</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Location *
                </label>

                <input
                  value={form.location}
                  onChange={(e) =>
                    updateForm("location", e.target.value)
                  }
                  placeholder="e.g. Noida"
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Employment Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    updateForm("type", e.target.value)
                  }
                  className="input-field mt-1"
                >
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Number of Openings
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.openings}
                  onChange={(e) =>
                    updateForm("openings", e.target.value)
                  }
                  className="input-field mt-1"
                />
              </div>

              <div className="flex items-end gap-3">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  <Plus size={16} />
                  Create
                </button>

              </div>

            </form>
          </div>
        )}

        {/* =====================================================
            ADD CANDIDATE FORM
        ====================================================== */}

        {showCandidateForm && (
          <div className="surface-card p-5 mb-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add Candidate
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Add a candidate to the recruitment pipeline.
                </p>
              </div>

              <button
                onClick={() => setShowCandidateForm(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={createCandidate}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Candidate Name *
                </label>

                <input
                  value={candidateForm.name}
                  onChange={(e) =>
                    updateCandidateForm(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Rahul Sharma"
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Email
                </label>

                <input
                  type="email"
                  value={candidateForm.email}
                  onChange={(e) =>
                    updateCandidateForm(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="candidate@email.com"
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Position *
                </label>

                <select
                  value={candidateForm.position}
                  onChange={(e) =>
                    updateCandidateForm(
                      "position",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                  required
                >
                  <option value="">
                    Select position
                  </option>

                  {jobs
                    .filter((job) => job.status === "Open")
                    .map((job) => (
                      <option
                        key={job.id}
                        value={job.title}
                      >
                        {job.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Experience
                </label>

                <input
                  value={candidateForm.experience}
                  onChange={(e) =>
                    updateCandidateForm(
                      "experience",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 2 Years"
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Applied Date
                </label>

                <input
                  type="date"
                  value={candidateForm.applied_date}
                  onChange={(e) =>
                    updateCandidateForm(
                      "applied_date",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Initial Stage
                </label>

                <select
                  value={candidateForm.stage}
                  onChange={(e) =>
                    updateCandidateForm(
                      "stage",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                >
                  <option>Applied</option>
                  <option>Screening</option>
                  <option>Interview</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                  <option>Hired</option>
                </select>
              </div>

              <div className="lg:col-span-3 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowCandidateForm(false)
                  }
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus size={16} />
                  Add Candidate
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =====================================================
            JOB OPENINGS
        ====================================================== */}

        <div className="surface-card overflow-hidden mb-5">

          <div className="p-5 border-b border-slate-200">

            <h2 className="font-semibold text-slate-900">
              Job Openings
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Current recruitment positions
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Position
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Department
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Location
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Type
                  </th>

                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                    Openings
                  </th>

                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                    Applicants
                  </th>

                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                    Status
                  </th>

                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {loadingJobs ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      Loading jobs...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No job openings found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-slate-100 hover:bg-slate-50/70"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                            <BriefcaseBusiness
                              size={17}
                              className="text-blue-600"
                            />
                          </div>

                          <span className="font-medium text-slate-800">
                            {job.title}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {job.department}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {job.location}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {job.type}
                      </td>

                      <td className="px-5 py-4 text-center font-medium">
                        {job.openings}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {job.applicants}
                      </td>

                      <td className="px-5 py-4 text-center">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            job.status === "Open"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {job.status}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              deleteJob(job.id)
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Job"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* =====================================================
            CANDIDATES
        ====================================================== */}

        <div className="surface-card overflow-hidden">

          <div className="p-5 border-b border-slate-200">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Candidates
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Manage applicants through the hiring process.
                </p>

              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                <div className="relative">

                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search candidate..."
                    className="input-field pl-9"
                  />

                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="input-field"
                >
                  <option value="All">
                    All Stages
                  </option>
                  <option value="Applied">
                    Applied
                  </option>
                  <option value="Screening">
                    Screening
                  </option>
                  <option value="Interview">
                    Interview
                  </option>
                  <option value="Selected">
                    Selected
                  </option>
                  <option value="Rejected">
                    Rejected
                  </option>
                  <option value="Hired">
                    Hired
                  </option>
                </select>

              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Candidate
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Position
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Experience
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                    Applied
                  </th>

                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                    Stage
                  </th>

                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {loadingCandidates ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      Loading candidates...
                    </td>
                  </tr>
                ) : filteredCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (

                    <tr
                      key={candidate.id}
                      className="border-b border-slate-100 hover:bg-slate-50/70"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-9 w-9 rounded-full bg-purple-50 flex items-center justify-center">

                            <Users
                              size={16}
                              className="text-purple-600"
                            />

                          </div>

                          <div>

                            <p className="font-medium text-slate-800">
                              {candidate.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {candidate.email || "No email"}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {candidate.position}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {candidate.experience}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-slate-500">

                          <CalendarDays size={14} />

                          {candidate.applied}

                        </div>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <StageBadge
                          stage={candidate.stage}
                        />

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1">

                          <button
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="View Candidate"
                            onClick={() =>
                              alert(
                                `${candidate.name}\n${candidate.email}\n${candidate.position}\n${candidate.experience}`
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          {candidate.stage === "Interview" && (
                            <button
                              onClick={() =>
                                updateCandidateStage(
                                  candidate.id,
                                  "Hired"
                                )
                              }
                              className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              title="Hire Candidate"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}

                          {candidate.stage !== "Rejected" &&
                            candidate.stage !== "Hired" && (
                              <button
                                onClick={() =>
                                  updateCandidateStage(
                                    candidate.id,
                                    "Rejected"
                                  )
                                }
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Reject Candidate"
                              >
                                <XCircle size={16} />
                              </button>
                            )}

                          <button
                            onClick={() =>
                              deleteCandidate(candidate.id)
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Candidate"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon,
  title,
  value,
  color,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="surface-card p-4">

      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        {title}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// STAGE BADGE
// =====================================================

function StageBadge({ stage }) {
  const styles = {
    Applied: "bg-blue-50 text-blue-600",
    Screening: "bg-purple-50 text-purple-600",
    Interview: "bg-amber-50 text-amber-600",
    Selected: "bg-emerald-50 text-emerald-600",
    Hired: "bg-emerald-50 text-emerald-600",
    Rejected: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[stage] || "bg-slate-100 text-slate-500"
      }`}
    >
      {stage}
    </span>
  );
}