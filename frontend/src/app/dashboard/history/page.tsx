"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Search, Download, Filter, FileText } from "lucide-react";

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const historyLogs = [
        { id: "log-1", time: "2026-03-04 10:45:22", type: "AI Optimization", junction: "Downtown Central (J1)", details: "Adjusted N-S phase duration to +15s due to heavy surge.", status: "Success" },
        { id: "log-2", time: "2026-03-04 10:12:05", type: "Manual Override", junction: "East River Cross (J3)", details: "Operator requested all-red phase for pedestrian crossing.", status: "Warning" },
        { id: "log-3", time: "2026-03-04 09:30:00", type: "System Event", junction: "Network Wide", details: "Routine ML model weights updated successfully.", status: "Success" },
        { id: "log-4", time: "2026-03-04 08:15:44", type: "Sensor Alert", junction: "Westside Avenue (J2)", details: "Eastbound camera occlusion detected. Vision confidence dropped.", status: "Error" },
        { id: "log-5", time: "2026-03-04 07:00:00", type: "Peak Transition", junction: "Network Wide", details: "Switched global operational mode to 'Morning Rush'.", status: "Success" },
    ];

    return (
        <div className="p-6 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Database className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System History</h1>
                        <p className="text-slate-400 text-sm">Immutable ledger of traffic events & overrides</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-cyan-600/20">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden"
            >
                <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search logs by keyword, location, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
                        />
                    </div>
                    <div className="text-sm text-slate-400 font-mono hidden sm:block">
                        Showing latest 5 entries
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50 font-medium">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Event Type</th>
                                <th className="px-6 py-4">Location / Target</th>
                                <th className="px-6 py-4 w-full">Detailed Description</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30 text-slate-300 bg-slate-900/20">
                            {historyLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{log.time}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-200">{log.junction}</td>
                                    <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{log.details}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                log.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex justify-between items-center text-sm text-slate-400">
                    <div>Page 1 of 124</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-slate-800 border border-slate-700 opacity-50 cursor-not-allowed">Prev</button>
                        <button className="px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:text-slate-200 hover:bg-slate-700 transition-colors">Next</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
