import React from 'react';
import { CheckCircle2, XCircle, ShieldAlert, UserCheck, Inbox } from 'lucide-react';

export default function CustomTasklistInbox({ apiBase, tasks, onTaskCompleted }) {
  const handleDecision = async (taskId, approved) => {
    try {
      const res = await fetch(`${apiBase}/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
      if (res.ok) {
        onTaskCompleted();
      }
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-semibold text-white">No Pending User Tasks in Camunda Tasklist</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          All high-privilege SaaS security approvals and Background Verification (BGV) sign-offs have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Custom Camunda 8 Tasklist Inbox</h2>
          <p className="text-xs text-slate-400">
            Complete human-in-the-loop approvals for Multi-Instance Security Gates and BGV Sub-Process Audits
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
          {tasks.length} Active User Tasks
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-slate-700 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                    task.taskType === 'SECURITY_ENTITLEMENT_APPROVAL'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {task.taskType === 'SECURITY_ENTITLEMENT_APPROVAL' ? (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5" />
                  )}
                  {task.assigneeRole}
                </span>
                <span className="text-xs text-slate-500">Task ID #{task.id}</span>
              </div>

              <h3 className="text-base font-bold text-white">{task.taskName}</h3>
              <p className="text-xs text-slate-300">
                Candidate: <strong className="text-blue-400">{task.employeeName}</strong>
              </p>
              <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {task.details}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDecision(task.id, true)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve &amp; Continue Workflow
              </button>
              <button
                onClick={() => handleDecision(task.id, false)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold py-2.5 px-4 rounded-xl transition"
              >
                <XCircle className="w-4 h-4" />
                {task.taskType === 'BGV_FINAL_AUDIT' ? 'Trigger BGV_FAILED Error' : 'Reject Entitlement'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}