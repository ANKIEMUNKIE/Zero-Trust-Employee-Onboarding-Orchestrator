import React from 'react';
import { CheckCircle, AlertOctagon, Clock, Terminal, Truck, KeyRound } from 'lucide-react';

export default function LiveStatusTracker({ onboardings, onSelectTab }) {
  if (onboardings.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <p className="text-base text-slate-300">No active onboarding workflows yet.</p>
        <button
          onClick={() => onSelectTab('launch')}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          Start Your First Onboarding Workflow
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onboardings.map((item) => (
        <div
          key={item.id}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl"
        >
          {/* Top Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">{item.employeeName}</h3>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                  Instance Key: {item.processInstanceKey}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {item.role} • {item.department} • {item.email}
              </p>
            </div>

            <div>
              {item.overallStatus === 'COMPLETED' && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle className="w-4 h-4" /> WORKFLOW COMPLETED (HARDWARE DISPATCHED)
                </span>
              )}
              {item.overallStatus === 'IN_PROGRESS' && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Clock className="w-4 h-4 animate-spin" /> AWAITING TASKLIST APPROVALS
                </span>
              )}
              {item.overallStatus === 'HALTED_BGV_FAILED' && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <AlertOctagon className="w-4 h-4" /> HALTED BY ERROR BOUNDARY (BGV_FAILED)
                </span>
              )}
            </div>
          </div>

          {/* 3-Column BPMN Construct Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Column 1: Multi-Instance SaaS Apps */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <KeyRound className="w-4 h-4" />
                Parallel Multi-Instance SaaS Apps
              </div>
              <div className="space-y-2">
                {item.requestedApps?.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between text-xs bg-slate-900 px-3 py-2 rounded-lg border border-slate-800"
                  >
                    <div>
                      <div className="font-semibold text-white">{app.appName}</div>
                      <div className="text-slate-400">{app.generatedAccountId || app.role}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        app.provisioningStatus === 'PROVISIONED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : app.provisioningStatus.includes('PENDING')
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {app.provisioningStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Embedded Sub-Process BGV */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Embedded Sub-Process: BGV &amp; References
              </div>
              <div className="text-xs space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Sub-Process Status:</span>
                  <strong className="text-white">{item.bgvStatus}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Sequential Multi-Instance References:</span>
                  {item.referenceList?.map((r, i) => (
                    <div key={i} className="text-slate-200 truncate">
                      ✓ {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Call Activity Hardware Procurement */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Truck className="w-4 h-4" />
                Call Activity: Hardware &amp; Courier
              </div>
              <div className="text-xs space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Hardware Asset Bundle:</span>
                  <strong className="text-white">{item.hardwareModel}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Call Activity Execution State:</span>
                  <strong className="text-emerald-300">{item.hardwareStatus}</strong>
                  {item.hardwareSerial && (
                    <div className="mt-1 text-slate-300">
                      Serial: <code>{item.hardwareSerial}</code> | Courier: <code>{item.courierTrackingId}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Zeebe Execution Audit Log */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Terminal className="w-4 h-4 text-blue-400" />
              Camunda 8 Zeebe Worker &amp; Event Execution Log
            </div>
            <div className="font-mono text-xs text-slate-300 space-y-1 max-h-40 overflow-y-auto">
              {item.auditLogs?.map((logLine, index) => (
                <div key={index} className="py-0.5 border-b border-slate-900">
                  {logLine}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}