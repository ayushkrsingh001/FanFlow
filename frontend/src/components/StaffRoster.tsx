import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Phone, ChevronDown, User } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  zone: string;
  status: 'on-duty' | 'break' | 'off-duty';
  shift: string;
  phone: string;
  avatar: string;
  specialization: string;
}

const STAFF_DATA: StaffMember[] = [
  { id: '1', name: 'Maria Garcia', role: 'Zone Supervisor', zone: 'Gate A', status: 'on-duty', shift: '06:00 – 14:00', phone: '+1-555-0101', avatar: 'MG', specialization: 'Crowd Control' },
  { id: '2', name: 'James Chen', role: 'Volunteer Lead', zone: 'C-lower', status: 'on-duty', shift: '06:00 – 14:00', phone: '+1-555-0102', avatar: 'JC', specialization: 'Accessibility' },
  { id: '3', name: 'Aisha Patel', role: 'First Aid Responder', zone: 'Gate B', status: 'on-duty', shift: '10:00 – 18:00', phone: '+1-555-0103', avatar: 'AP', specialization: 'Medical' },
  { id: '4', name: 'David Okafor', role: 'Transit Coordinator', zone: 'South-plaza', status: 'break', shift: '06:00 – 14:00', phone: '+1-555-0104', avatar: 'DO', specialization: 'Transport' },
  { id: '5', name: 'Sophie Martin', role: 'Volunteer', zone: 'A-upper', status: 'on-duty', shift: '10:00 – 18:00', phone: '+1-555-0105', avatar: 'SM', specialization: 'Wayfinding' },
  { id: '6', name: 'Ahmed Hassan', role: 'Security Officer', zone: 'Gate C', status: 'on-duty', shift: '06:00 – 14:00', phone: '+1-555-0106', avatar: 'AH', specialization: 'Security' },
  { id: '7', name: 'Lena Johansson', role: 'Volunteer', zone: 'Gate D', status: 'off-duty', shift: '14:00 – 22:00', phone: '+1-555-0107', avatar: 'LJ', specialization: 'Multilingual' },
  { id: '8', name: 'Carlos Rivera', role: 'Operations Manager', zone: 'Control Room', status: 'on-duty', shift: '06:00 – 18:00', phone: '+1-555-0108', avatar: 'CR', specialization: 'Management' },
  { id: '9', name: 'Priya Sharma', role: 'Volunteer', zone: 'C-lower', status: 'on-duty', shift: '10:00 – 18:00', phone: '+1-555-0109', avatar: 'PS', specialization: 'Sustainability' },
  { id: '10', name: 'Tom Williams', role: 'First Aid Responder', zone: 'A-upper', status: 'break', shift: '06:00 – 14:00', phone: '+1-555-0110', avatar: 'TW', specialization: 'Medical' },
  { id: '11', name: 'Fatima Al-Rashid', role: 'Zone Supervisor', zone: 'Gate B', status: 'on-duty', shift: '10:00 – 18:00', phone: '+1-555-0111', avatar: 'FA', specialization: 'Crowd Control' },
  { id: '12', name: 'Mark Thompson', role: 'Volunteer', zone: 'South-plaza', status: 'on-duty', shift: '06:00 – 14:00', phone: '+1-555-0112', avatar: 'MT', specialization: 'Wayfinding' },
];

const STATUS_CONFIG = {
  'on-duty': { label: 'On Duty', color: 'bg-[#F0FDF4] text-[#166534]', dot: 'bg-[#22C55E]' },
  'break': { label: 'On Break', color: 'bg-[#FFFBEB] text-[#92400E]', dot: 'bg-[#F59E0B]' },
  'off-duty': { label: 'Off Duty', color: 'bg-[#F1F5F9] text-[#64748B]', dot: 'bg-[#94A3B8]' },
};

export default function StaffRoster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredStaff = STAFF_DATA.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onDutyCount = STAFF_DATA.filter((s) => s.status === 'on-duty').length;
  const onBreakCount = STAFF_DATA.filter((s) => s.status === 'break').length;
  const offDutyCount = STAFF_DATA.filter((s) => s.status === 'off-duty').length;

  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Staff Roster</h2>
          <p className="text-sm text-[#64748B] mt-1">Manage volunteers and staff deployment across zones</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#64748B]">Total Staff</span>
            <User size={16} className="text-[#16A34A]" />
          </div>
          <span className="text-2xl font-bold text-[#0F172A]">{STAFF_DATA.length}</span>
          <div className="mt-2 text-xs text-[#64748B] font-medium">Registered personnel</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#64748B]">On Duty</span>
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
          </div>
          <span className="text-2xl font-bold text-[#16A34A]">{onDutyCount}</span>
          <div className="mt-2 text-xs text-[#64748B] font-medium">Currently active</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#64748B]">On Break</span>
            <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
          </div>
          <span className="text-2xl font-bold text-[#D97706]">{onBreakCount}</span>
          <div className="mt-2 text-xs text-[#64748B] font-medium">Returning shortly</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#64748B]">Off Duty</span>
            <div className="w-2 h-2 rounded-full bg-[#94A3B8]"></div>
          </div>
          <span className="text-2xl font-bold text-[#64748B]">{offDutyCount}</span>
          <div className="mt-2 text-xs text-[#64748B] font-medium">Next shift pending</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="roster-search" className="sr-only">Search staff</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
          <input
            id="roster-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or zone..."
            className="input-enterprise w-full pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="btn-enterprise bg-white border border-[#E2E8F0] text-[#334155] px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-[#F8FAFC] w-full sm:w-auto justify-center"
          >
            <Filter size={16} />
            {statusFilter === 'all' ? 'All Status' : STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]?.label}
            <ChevronDown size={14} />
          </button>
          {showFilterDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-12 w-44 bg-white border border-[#E2E8F0] rounded-md shadow-[0_4px_24px_rgba(15,23,42,.1)] z-30 overflow-hidden"
            >
              {['all', 'on-duty', 'break', 'off-duty'].map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8FAFC] transition-colors ${statusFilter === status ? 'bg-[#F0FDF4] font-semibold text-[#16A34A]' : 'text-[#0F172A]'}`}
                >
                  {status === 'all' ? 'All Status' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-md overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,.05)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Staff Member</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Zone</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Shift</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Specialization</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member, idx) => {
                const statusConf = STATUS_CONFIG[member.status];
                return (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#16A34A]">{member.avatar}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0F172A]">{member.name}</div>
                          <div className="text-xs text-[#64748B]">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#0F172A]">
                        <MapPin size={14} className="text-[#64748B]" />
                        {member.zone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#0F172A]">
                        <Clock size={14} className="text-[#64748B]" />
                        {member.shift}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConf.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#64748B]">{member.specialization}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                        <Phone size={14} />
                        {member.phone}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#64748B]">
                    No staff members match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
