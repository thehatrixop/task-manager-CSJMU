// database/seed.ts
// Realistic seed data for CampusFlow matching brain.md entities

export const SeedDepartments = [
  { code: 'DEPT-ELEC-01', name: 'Electrical & Power Systems', superintendent: 'Er. Anand Verma' },
  { code: 'DEPT-HVAC-02', name: 'HVAC & Climate Control', superintendent: 'Er. Meenakshi S.' },
  { code: 'DEPT-PLUM-03', name: 'Plumbing & Water Core', superintendent: 'Er. Suresh Babu' },
  { code: 'DEPT-CIVL-04', name: 'Civil & Structural Maintenance', superintendent: 'Er. K. Natarajan' },
  { code: 'DEPT-CARP-05', name: 'Carpentry & Locksmith', superintendent: 'Er. Harish Rao' },
  { code: 'DEPT-GENL-06', name: 'General Logistics & Sanitation', superintendent: 'Er. Geeta Menon' }
];

export const SeedUsers = [
  {
    name: 'Aarav Patel',
    email: 'aarav.patel@eng.university.edu',
    phone: '+91 98765 43210',
    role: 'USER',
    campusId: '2024-ENG-UG-0142',
    jurisdiction: 'Hostel Block D, Rm 312'
  },
  {
    name: 'Dr. Ramesh Sharma',
    email: 'ramesh.sharma@faculty.university.edu',
    phone: '+91 98220 11200',
    role: 'AUTHORITY',
    campusId: 'FAC-ELEC-881',
    jurisdiction: 'Academic Block B & Labs'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@technician.university.edu',
    phone: '+91 98231 44102',
    role: 'WORKER',
    campusId: 'WRK-0018',
    jurisdiction: 'Academic Block B & Labs',
    isOnline: true
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@technician.university.edu',
    phone: '+91 98231 44103',
    role: 'WORKER',
    campusId: 'WRK-0019',
    jurisdiction: 'Academic Block B & Labs',
    isOnline: true
  },
  {
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@facilities.university.edu',
    phone: '+91 98110 33400',
    role: 'ADMIN',
    campusId: 'ADM-DIR-004',
    jurisdiction: 'Campus-Wide Facilities Command'
  },
  {
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@governance.university.edu',
    phone: '+91 98000 99999',
    role: 'SUPER_ADMIN',
    campusId: 'ROOT-EXEC-001',
    jurisdiction: 'All University Nodes'
  }
];

export const SeedComplaints = [
  {
    id: 'CF-2026-00124',
    title: 'Switchboard Malfunction & Sparking',
    description: 'Main laboratory switchboard in Room 204 experienced intermittent sparking when high-draw oscilloscopes were activated. Faint burning odor noted near circuit breaker #4.',
    locationDesc: 'Academic Block B, Second Floor, Room 204, Near Laboratory Entrance',
    priority: 'HIGH',
    status: 'ACTIVE_IN_PROGRESS',
    departmentCode: 'DEPT-ELEC-01',
    complainantEmail: 'aarav.patel@eng.university.edu',
    assignedWorkerCampusId: 'WRK-0018',
    verifiedBy: 'Dr. Ramesh Sharma'
  }
];

