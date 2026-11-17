-- ============================================================================
-- CampusFlow: Supabase PostgreSQL Database Schema & Initial Seed
-- University Facility Management & Autonomous Workforce Dispatch SaaS
-- Compatible with Supabase SQL Editor and Prisma ORM
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'AUTHORITY', 'WORKER', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_status AS ENUM (
        'PENDING_VERIFICATION',
        'APPROVED_AWAITING_DISPATCH',
        'WORKER_DISPATCHED',
        'ACTIVE_IN_PROGRESS',
        'AWAITING_MATERIALS',
        'TEMPORARILY_BLOCKED',
        'RESOLVED',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assignment_status AS ENUM (
        'OFFERED',
        'ACCEPTED',
        'DECLINED',
        'EXPIRED_TIMEOUT',
        'REASSIGNED',
        'FORCE_OVERRIDDEN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'DEPT-ELEC-01'
    name VARCHAR(150) NOT NULL,       -- 'Electrical & Power Systems'
    superintendent VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'USER',
    campus_id VARCHAR(50),            -- Roll Number or Employee ID (e.g. '2024-ENG-UG-0142')
    jurisdiction VARCHAR(255),        -- e.g. 'Academic Block B & Labs'
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMPLAINTS (TICKETS) TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(50) PRIMARY KEY,       -- 'CF-2026-00124'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_desc VARCHAR(255) NOT NULL,
    priority ticket_priority DEFAULT 'MEDIUM',
    status complaint_status DEFAULT 'PENDING_VERIFICATION',
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    complainant_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Verification details
    verified_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Evidence & Photos
    submitted_photos TEXT[] DEFAULT '{}',
    completion_notes TEXT,
    completion_proof TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 30-MINUTE SLA ASSIGNMENT ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS assignment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(50) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_number INT DEFAULT 1,
    match_score NUMERIC(5, 2) NOT NULL, -- e.g. 96.40
    status assignment_status DEFAULT 'OFFERED',
    dispatched_at TIMESTAMPTZ DEFAULT NOW(),
    deadline_at TIMESTAMPTZ NOT NULL,   -- dispatched_at + 30 minutes
    responded_at TIMESTAMPTZ,
    decline_reason TEXT
);

-- 7. IMMUTABLE SHA-256 AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(50) UNIQUE NOT NULL, -- 'EVT-2026-0089'
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action VARCHAR(100) NOT NULL,         -- 'VERIFY_TICKET', 'ACCEPT_DISPATCH', 'COMPLETE_JOB'
    complaint_id VARCHAR(50) REFERENCES complaints(id) ON DELETE SET NULL,
    from_state VARCHAR(50),
    to_state VARCHAR(50),
    sha256_hash VARCHAR(64) NOT NULL,     -- Cryptographic tamper-proof proof
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_dept ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_complainant ON complaints(complainant_id);
CREATE INDEX IF NOT EXISTS idx_complaints_worker ON complaints(worker_id);
CREATE INDEX IF NOT EXISTS idx_assignment_deadline ON assignment_attempts(deadline_at);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_logs(event_id);

-- 9. AUTOMATIC updated_at TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_users ON users;
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_complaints ON complaints;
CREATE TRIGGER set_timestamp_complaints
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of departments for registration
DROP POLICY IF EXISTS "Public can view departments" ON departments;
CREATE POLICY "Public can view departments" ON departments FOR SELECT USING (true);

-- Allow authenticated reads and service_role full bypass
DROP POLICY IF EXISTS "Enable read access for all users on complaints" ON complaints;
CREATE POLICY "Enable read access for all users on complaints" ON complaints FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all operations for service role" ON users;
CREATE POLICY "Enable all operations for service role" ON users FOR ALL USING (true);

-- ============================================================================
-- 11. INITIAL SEED DATA (INSTITUTIONAL ROSTER & DEMO COMPLAINTS)
-- ============================================================================

-- Insert Standard Departments
INSERT INTO departments (id, code, name, superintendent)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'DEPT-ELEC-01', 'Electrical & Power Systems', 'Vikramaditya Rao'),
    ('22222222-2222-2222-2222-222222222222', 'DEPT-PLUM-02', 'Plumbing & Hydraulic Infrastructure', 'Sunil Mehta'),
    ('33333333-3333-3333-3333-333333333333', 'DEPT-HVAC-03', 'HVAC & Climate Control', 'Anita Deshmukh'),
    ('44444444-4444-4444-4444-444444444444', 'DEPT-CIVL-04', 'Civil Works & Structural Maintenance', 'Prakash Joshi'),
    ('55555555-5555-5555-5555-555555555555', 'DEPT-ITNET-05', 'Campus Networking & Smart Classrooms', 'Kavita Iyer')
ON CONFLICT (code) DO NOTHING;

-- Insert Institutional Seed Accounts
-- Passwords below are salted SHA-256 representations for simulation demo ('Campus@2026' / 'password123')
INSERT INTO users (id, name, email, phone, password_hash, role, campus_id, jurisdiction, department_id, is_online)
VALUES
    -- 1. Student / Complainant (Aarav Patel)
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Aarav Patel', 'aarav.patel@eng.university.edu', '+919876543210', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'USER', '2024-ENG-UG-0142', NULL, NULL, true),
    
    -- 2. Authority / HOD / Warden (Dr. Ramesh Sharma)
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dr. Ramesh Sharma', 'ramesh.sharma@university.edu', '+919822011223', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'AUTHORITY', 'EMP-AUTH-1092', 'Academic Block B & Labs', '11111111-1111-1111-1111-111111111111', true),
    
    -- 3. Field Technician / Worker (Rajesh Kumar - Senior Electrician)
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Rajesh Kumar', 'rajesh.kumar@technicians.university.edu', '+919411055443', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'WORKER', 'WRK-0018', 'Campus Zone North', '11111111-1111-1111-1111-111111111111', true),
    
    -- 4. Facilities Admin (Vikramaditya Rao)
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Vikramaditya Rao', 'facilities.superintendent@university.edu', '+919110088776', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'ADMIN', 'EMP-ADM-0045', 'All Campus Facilities', '11111111-1111-1111-1111-111111111111', true),
    
    -- 5. Platform Super Admin (Dr. Aris Thorne)
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Dr. Aris Thorne', 'operations.director@university.edu', '+919999900001', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'SUPER_ADMIN', 'EXEC-DIR-0001', 'Global University System', NULL, true)
ON CONFLICT (email) DO NOTHING;

-- Insert Primary Demo Complaint: CF-2026-00124 (Electrical Switchboard Malfunction)
INSERT INTO complaints (
    id, title, description, location_desc, priority, status, 
    department_id, complainant_id, worker_id, verified_by_id, verified_at, submitted_photos
)
VALUES (
    'CF-2026-00124',
    'Electrical Switchboard Malfunction & Sparking',
    'The main power distribution board near Lab 204 emitted visible sparks and intermittent tripping during high-load physics simulation runs.',
    'Academic Block B, Second Floor, Room 204 (Physics Computing Lab)',
    'HIGH',
    'ACTIVE_IN_PROGRESS',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    NOW() - INTERVAL '45 minutes',
    ARRAY['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800']
)
ON CONFLICT (id) DO NOTHING;

-- Insert 30-Minute SLA Attempt for Rajesh Kumar
INSERT INTO assignment_attempts (
    complaint_id, candidate_id, attempt_number, match_score, status, dispatched_at, deadline_at
)
VALUES (
    'CF-2026-00124',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    1,
    98.40,
    'ACCEPTED',
    NOW() - INTERVAL '35 minutes',
    NOW() - INTERVAL '5 minutes'
)
ON CONFLICT DO NOTHING;
