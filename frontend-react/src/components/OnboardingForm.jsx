import React, { useState } from 'react';
import { Plus, Trash2, Rocket, ShieldAlert, Laptop, UserCheck } from 'lucide-react';

export default function OnboardingForm({ apiBase, onSuccess }) {
  const [employeeName, setEmployeeName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.sharma@atlassian-enterprise.io');
  const [department, setDepartment] = useState('Cloud Platform Engineering');
  const [role, setRole] = useState('Senior Principal Site Reliability Engineer');
  const [clearanceLevel, setClearanceLevel] = useState('LEVEL_3_PRODUCTION_ZERO_TRUST');
  const [hardwareModel, setHardwareModel] = useState('MacBook Pro 16" M3 Max (64GB RAM) + YubiKey 5C NFC');
  const [shippingAddress, setShippingAddress] = useState('Tower B, Embassy TechVillage, Outer Ring Rd, Bengaluru');
  const [simulateBgvFailure, setSimulateBgvFailure] = useState(false);

  // Dynamic Array Builder 1: Parallel Multi-Instance SaaS Applications
  const [requestedApps, setRequestedApps] = useState([
    { appName: 'GitHub Enterprise', role: 'Maintainer', requiresSecurityApproval: false },
    { appName: 'AWS Production Root', role: 'IAMSecurityAdmin', requiresSecurityApproval: true },
    { appName: 'Jira Software Cloud', role: 'ProjectAdmin', requiresSecurityApproval: false },
    { appName: 'Slack Enterprise Grid', role: 'Member', requiresSecurityApproval: false }
  ]);

  // Dynamic Array Builder 2: Sequential Multi-Instance Past Employer References
  const [referenceList, setReferenceList] = useState([
    'Vikram Rao (VP Engineering @ Razorpay - vikram@razorpay.com)',
    'Neha Gupta (Principal Architect @ Swiggy - neha@swiggy.in)'
  ]);

  const [newAppName, setNewAppName] = useState('');
  const [newAppRole, setNewAppRole] = useState('Developer');
  const [newAppSec, setNewAppSec] = useState(false);
  const [newRef, setNewRef] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addAppItem = () => {
    if (!newAppName.trim()) return;
    setRequestedApps([
      ...requestedApps,
      { appName: newAppName.trim(), role: newAppRole, requiresSecurityApproval: newAppSec }
    ]);
    setNewAppName('');
    setNewAppSec(false);
  };

  const removeAppItem = (index) => {
    setRequestedApps(requestedApps.filter((_, idx) => idx !== index));
  };

  const addReferenceItem = () => {
    if (!newRef.trim()) return;
    setReferenceList([...referenceList, newRef.trim()]);
    setNewRef('');
  };

  const removeReferenceItem = (index) => {
    setReferenceList(referenceList.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/onboarding/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName,
          email,
          department,
          role,
          clearanceLevel,
          hardwareModel,
          shippingAddress,
          simulateBgvFailure,
          requestedApps,
          referenceList
        })
      });
      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      alert('Failed to connect to Spring Boot backend on port 8080.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Employee & Hardware Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-base border-b border-slate-800 pb-3">
            <UserCheck className="w-5 h-5" />
            1. New Hire Identity &amp; Hardware Asset Specification
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Employee Full Name</label>
              <input
                type="text"
                required
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Zero-Trust Clearance Tier</label>
              <select
                value={clearanceLevel}
                onChange={(e) => setClearanceLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="LEVEL_1_STANDARD">LEVEL 1 - Standard Corporate</option>
                <option value="LEVEL_2_STAGING">LEVEL 2 - Staging &amp; Internal Repos</option>
                <option value="LEVEL_3_PRODUCTION_ZERO_TRUST">LEVEL 3 - Production Zero-Trust Admin</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Laptop className="w-4 h-4" />
              Call Activity Input: Hardware Procurement &amp; Courier
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hardware Bundle</label>
              <input
                type="text"
                value={hardwareModel}
                onChange={(e) => setHardwareModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Courier Delivery Address</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          {/* Exception Simulation Toggle */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-3">
            <input
              type="checkbox"
              id="simBgvError"
              checked={simulateBgvFailure}
              onChange={(e) => setSimulateBgvFailure(e.target.checked)}
              className="mt-1 w-4 h-4 accent-rose-500"
            />
            <label htmlFor="simBgvError" className="text-xs text-rose-200 cursor-pointer">
              <span className="font-bold text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                Simulate BGV Failure (Trigger BPMN Error Boundary Event `BGV_FAILED`)
              </span>
              When enabled, the BGV Sub-Process throws a <code>ZeebeBpmnError</code>, revokes provisional SaaS accounts, and halts the Hardware Procurement Call Activity.
            </label>
          </div>
        </div>

        {/* Right Card: Dynamic Array Item Builders (Multi-Instance Inputs) */}
        <div className="space-y-6">
          {/* Dynamic Array 1: Parallel Multi-Instance SaaS Apps */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-blue-400 font-semibold text-base">
                  2. SaaS Entitlements (Parallel Multi-Instance `=requestedApps`)
                </h3>
                <p className="text-xs text-slate-400">
                  Each item spawns a concurrent sub-process instance in Camunda 8
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {requestedApps.length} Parallel Instances
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {requestedApps.map((app, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-white">{app.appName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {app.role}
                    </span>
                    {app.requiresSecurityApproval ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Requires Security Approval Task
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Auto REST Provision
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAppItem(index)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-800 items-center">
              <input
                type="text"
                placeholder="SaaS App (e.g., Datadog, Snowflake)"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                className="sm:col-span-5 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Role"
                value={newAppRole}
                onChange={(e) => setNewAppRole(e.target.value)}
                className="sm:col-span-3 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <label className="sm:col-span-2 flex items-center gap-1 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAppSec}
                  onChange={(e) => setNewAppSec(e.target.checked)}
                />
                Sec Gate
              </label>
              <button
                type="button"
                onClick={addAppItem}
                className="sm:col-span-2 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-1.5 px-3 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Dynamic Array 2: Sequential Multi-Instance References */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-purple-400 font-semibold text-base">
                  3. Employer References (Sequential Multi-Instance `=references`)
                </h3>
                <p className="text-xs text-slate-400">
                  Verified sequentially inside the Background Check Embedded Sub-Process
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                {referenceList.length} Sequential Steps
              </span>
            </div>

            <div className="space-y-2">
              {referenceList.map((ref, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-200"
                >
                  <span>
                    <strong className="text-purple-400 mr-2">#{idx + 1}</strong>
                    {ref}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeReferenceItem(idx)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Add Reference Name, Company & Email..."
                value={newRef}
                onChange={(e) => setNewRef(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={addReferenceItem}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium py-1.5 px-3 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Reference
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition"
        >
          <Rocket className="w-5 h-5" />
          {submitting ? 'Deploying Workflow Instance...' : 'Launch Camunda 8 Onboarding Workflow'}
        </button>
      </div>
    </form>
  );
}