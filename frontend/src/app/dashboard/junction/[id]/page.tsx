"use client";

import { useEffect, useState, use } from "react";
import {
    ArrowLeft, Activity, Clock, Navigation, AlertCircle,
    Zap, ShieldAlert, CheckCircle2, BarChart3, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LineChart, Line, ResponsiveContainer
} from 'recharts';

interface Lane {
    direction: string;
    vehicle_count: number;
    density_value: number;
    queue_length: number;
    signal_state: 'Green' | 'Red' | 'Yellow';
    remaining_time: number;
}

interface JunctionData {
    junction_id: string;
    lanes: Lane[];
    metrics: {
        total_vehicles: number;
        avg_waiting_time: number;
        avg_speed: number;
        overall_congestion: number;
    };
}

export default function JunctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<JunctionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [overrideActive, setOverrideActive] = useState<string | null>(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        setRole(localStorage.getItem("traffix_role") || "");

        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/junction/${id}/traffic`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Traffic data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [id]);

    const handleManualOverride = async (direction: string) => {
        if (!["Super Admin", "Emergency Authority"].includes(role)) {
            alert("Unauthorized: Inadequate clearance for manual override.");
            return;
        }

        if (confirm(`INITIATE MANUAL OVERRIDE: Force Green for ${direction} lane?`)) {
            setOverrideActive(direction);
            try {
                await fetch("http://localhost:8000/api/signal/control", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ junction_id: id, action: `Force Green ${direction}` }),
                });
                setTimeout(() => setOverrideActive(null), 10000); // Clear override after 10s for demo
            } catch (err) {
                console.error("Signal control error:", err);
            }
        }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center bg-[#0F172A]">
            <div className="text-center">
                <Activity className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
                <p className="text-cyan-400 font-mono text-sm animate-pulse">ESTABLISHING ENCRYPTED LINK TO NODE {id}...</p>
            </div>
        </div>
    );

    if (!data) return <div className="p-8 text-white">Error: Junction not found or lost connection.</div>;

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-20">
            {/* Header & Back Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 glass-panel border border-slate-700 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                            Junction Workspace: <span className="text-cyan-400 uppercase">{id}</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Telemetry Stream • Sync: Stable
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {role === "Emergency Authority" && (
                        <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center gap-2 animate-pulse">
                            <ShieldAlert className="w-5 h-5" /> EMERGENCY CLEARANCE
                        </button>
                    )}
                    <div className="glass-panel px-4 py-2 rounded-lg border border-slate-700 text-xs font-mono">
                        <span className="text-slate-500">LAST CALC:</span> <span className="text-cyan-400">0.034ms</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Real-time Metrics Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Top Summary Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Active Flow", value: data.metrics.total_vehicles, unit: "Vehicles", icon: Navigation, color: "text-blue-400" },
                            { label: "Avg Wait", value: data.metrics.avg_waiting_time, unit: "Seconds", icon: Clock, color: "text-yellow-400" },
                            { label: "Current Speed", value: data.metrics.avg_speed, unit: "km/h", icon: Activity, color: "text-green-400" },
                            { label: "Congestion", value: (data.metrics.overall_congestion * 100).toFixed(0), unit: "%", icon: AlertCircle, color: "text-red-400" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-4 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Live</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-slate-100">{stat.value}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{stat.unit}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Lane Status Board */}
                    <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
                            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-cyan-500" /> Multi-Lane Telemetry
                            </h2>
                            <span className="text-[10px] font-mono text-cyan-500/70">AI ENGINE: OPTIMIZING...</span>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.lanes.map((lane, idx) => (
                                <div key={idx} className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                                    {/* Traffic Light Visual */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-1.5 p-1.5 bg-black/40 rounded-lg border border-slate-700">
                                        <div className={`w-3 h-3 rounded-full ${lane.signal_state === 'Red' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-900/50'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${lane.signal_state === 'Yellow' ? 'bg-yellow-500 shadow-[0_0_8px_#f59e0b]' : 'bg-yellow-900/50'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${lane.signal_state === 'Green' ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-green-900/50'}`}></div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 border ${lane.signal_state === 'Green' ? 'border-green-500/50 animate-pulse' : 'border-slate-700'}`}>
                                            <Navigation className={`w-5 h-5 ${lane.direction === 'North' ? '' : lane.direction === 'East' ? 'rotate-90' : lane.direction === 'South' ? 'rotate-180' : '-rotate-90'} ${lane.signal_state === 'Green' ? 'text-green-400' : 'text-slate-500'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-100">{lane.direction} Corridor</h3>
                                            <p className="text-[10px] text-slate-500 font-mono">LANE-ID: {id}-{lane.direction.slice(0, 1)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                                            <p className="text-[9px] text-slate-500 uppercase">Vehicles</p>
                                            <p className="font-bold text-slate-200">{lane.vehicle_count}</p>
                                        </div>
                                        <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                                            <p className="text-[9px] text-slate-500 uppercase">Queue</p>
                                            <p className="font-bold text-slate-200">{lane.queue_length}m</p>
                                        </div>
                                        <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                                            <p className="text-[9px] text-slate-500 uppercase">Density</p>
                                            <p className="font-bold text-slate-200">{(lane.density_value * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                            <span className="text-xs font-mono text-cyan-400">{lane.remaining_time}s <span className="text-slate-600 text-[10px]">REMAINING</span></span>
                                        </div>
                                        <button
                                            onClick={() => handleManualOverride(lane.direction)}
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 transition-all uppercase tracking-tighter
                        ${overrideActive === lane.direction ? 'ring-1 ring-cyan-500 text-cyan-400' : 'text-slate-400'}
                      `}
                                        >
                                            {overrideActive === lane.direction ? 'Override Active' : 'Manual Signal'}
                                        </button>
                                    </div>

                                    {/* Density Bar */}
                                    <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${lane.density_value > 0.7 ? 'bg-red-500' : lane.density_value > 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${lane.density_value * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls & Logic */}
                <div className="space-y-6">

                    {/* Signal Optimization Panel */}
                    <div className="glass-panel rounded-2xl border border-slate-700/50 p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full"></div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-cyan-400" /> AI Optimization Engine
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <p className="text-xs text-slate-400 mb-2">DYNAMIC ADJUSTMENT LOAD</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-cyan-400">0.82 <span className="text-xs text-slate-600 font-mono">SCALE</span></span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(b => (
                                            <div key={b} className={`w-1.5 h-6 rounded-full ${b <= 4 ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Calculated Weights</p>
                                {[
                                    { l: "Primary Lane Bias", v: "High" },
                                    { l: "Pedestrian Delay", v: "Minimal" },
                                    { l: "Transit Priority", v: "Active" }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-800/50">
                                        <span className="text-slate-400">{row.l}</span>
                                        <span className="text-slate-200 font-mono">{row.v}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                                Recalibrate Phase Logic
                            </button>
                        </div>
                    </div>

                    {/* Traffic Forecast Preview */}
                    <div className="glass-panel rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-orange-400" /> T-Forecast (1Hr)
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold text-slate-100">+12%</div>
                                <div className="text-xs text-slate-400">Expected density increase due to rush hour start.</div>
                            </div>

                            <div className="h-24 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[
                                        { t: '12:00', v: 40 }, { t: '12:15', v: 45 }, { t: '12:30', v: 55 },
                                        { t: '12:45', v: 62 }, { t: '13:00', v: 75 }
                                    ]}>
                                        <Line type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-800/50 p-2 rounded text-center">
                                    <p className="text-[8px] text-slate-500">NEXT PEAK</p>
                                    <p className="text-xs font-bold text-orange-400 uppercase">17:45 PM</p>
                                </div>
                                <div className="flex-1 bg-slate-800/50 p-2 rounded text-center">
                                    <p className="text-[8px] text-slate-500">LEVEL</p>
                                    <p className="text-xs font-bold text-red-500 uppercase">HEAVY</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Event Log Fixed Footer (Desktop) */}
            <div className="hidden md:block fixed bottom-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-md border-t border-slate-800/50 z-[100] px-8">
                <div className="h-full flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-6">
                        <span className="text-cyan-500 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> NODE-{id} CONNECTION SECURE</span>
                        <span className="text-slate-500 italic">&ldquo;Detected 5 vehicles on North approach...&rdquo;</span>
                        <span className="text-slate-500 italic">&ldquo;Signal phase optimized for East corridor...&rdquo;</span>
                    </div>
                    <div className="text-slate-400 uppercase">
                        GMT: {new Date().toLocaleTimeString()} • LATENCY: 24ms
                    </div>
                </div>
            </div>
        </div>
    );
}
