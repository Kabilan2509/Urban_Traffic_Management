"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Mail,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type UserRole = "Super Admin" | "Traffic Engineer" | "Traffic Operator" | "Emergency Authority";
type UserStatus = "Active" | "Suspended";

interface AuthorityUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zone: string;
  status: UserStatus;
}

const initialUsers: AuthorityUser[] = [
  {
    id: "USR-001",
    name: "Kabil R",
    email: "kabil@citytraffic.gov",
    role: "Super Admin",
    zone: "Central Command",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Anita Sharma",
    email: "anita.sharma@citytraffic.gov",
    role: "Traffic Engineer",
    zone: "Downtown Sector",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Rahul Menon",
    email: "rahul.menon@citytraffic.gov",
    role: "Traffic Operator",
    zone: "West Corridor",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Priya Nair",
    email: "priya.nair@citytraffic.gov",
    role: "Emergency Authority",
    zone: "Rapid Response Unit",
    status: "Suspended",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [users] = useState(initialUsers);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch = roleFilter === "All" || user.role === roleFilter;
      const query = search.toLowerCase();
      const textMatch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.zone.toLowerCase().includes(query);

      return roleMatch && textMatch;
    });
  }, [users, roleFilter, search]);

  return (
    <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <Users className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">User Access Management</h1>
            <p className="text-sm text-slate-400">Manage authority accounts, roles, and operational zones</p>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold shadow-lg shadow-cyan-600/20 transition-colors">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Total Accounts</p>
          <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="glass-panel border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Active</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{users.filter((u) => u.status === "Active").length}</p>
        </div>
        <div className="glass-panel border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Privileged Roles</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{users.filter((u) => u.role === "Super Admin" || u.role === "Emergency Authority").length}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, ID, or zone"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Traffic Engineer">Traffic Engineer</option>
            <option value="Traffic Operator">Traffic Operator</option>
            <option value="Emergency Authority">Emergency Authority</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-5 py-3">Authority</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Zone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 bg-slate-900/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{user.id}</p>
                      <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-xs">
                      <Shield className="w-3 h-3" /> {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" /> {user.zone}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {user.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-3 py-1.5 text-xs rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-cyan-500 transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No accounts match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
