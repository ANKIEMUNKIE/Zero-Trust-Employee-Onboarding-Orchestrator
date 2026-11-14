import React, { useState, useEffect } from 'react';
import OnboardingForm from './components/OnboardingForm';
import CustomTasklistInbox from './components/CustomTasklistInbox';
import LiveStatusTracker from './components/LiveStatusTracker';
import { ShieldCheck, Layers, CheckSquare, Activity, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('launch');
  const [onboardings, setOnboardings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [onbRes, taskRes] = await Promise.all([
        fetch(`${API_BASE}/onboarding`),
        fetch(`${API_BASE}/tasks`)
      ]);
      if (onbRes.ok) setOnboardings(await onbRes.json());
      if (taskRes.ok) setTasks(await taskRes.json());
    } catch (err) {
      console.error('Backend connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWorkflowStarted = () => {
    fetchAllData();
    setActiveTab('tracker');
  };

  const handleTaskCompleted = () => {
    fetchAllData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Zero-Trust Employee Onboarding Orchestrator
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  Camunda 8 + Spring Boot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Project 28 (Inspired by Atlassian) • Multi-Instance SaaS Provisioning, BGV Sub-Process &amp; Hardware Call Activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('launch')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'launch'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              New Hire Onboarding
            </button>

            <button
              onClick={() => setActiveTab('tasklist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'tasklist'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Custom Tasklist Inbox
              {tasks.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500 text-slate-950 font-bold">
                  {tasks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'tracker'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              Live Process Tracker ({onboardings.length})
            </button>

            <button
              onClick={fetchAllData}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              title="Refresh State"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        {activeTab === 'launch' && (
          <OnboardingForm apiBase={API_BASE} onSuccess={handleWorkflowStarted} />
        )}
        {activeTab === 'tasklist' && (
          <CustomTasklistInbox apiBase={API_BASE} tasks={tasks} onTaskCompleted={handleTaskCompleted} />
        )}
        {activeTab === 'tracker' && (
          <LiveStatusTracker onboardings={onboardings} onSelectTab={setActiveTab} />
        )}
      </main>
    </div>
  );
}