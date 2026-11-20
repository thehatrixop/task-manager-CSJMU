# build-tools/generate_docs.py
import os
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    shading_xml = f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_docx(output_path):
    doc = Document()

    # Set page margins (0.75 in)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # Color definitions
    COLOR_PRIMARY = RGBColor(15, 23, 42)    # Slate 900 #0f172a
    COLOR_ACCENT = RGBColor(5, 150, 105)    # Emerald 600 #059669
    COLOR_MUTED = RGBColor(100, 116, 139)   # Slate 500 #64748b
    COLOR_DARK = RGBColor(30, 41, 59)       # Slate 800 #1e293b

    # Document Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    run_title = p_title.add_run("CampusFlow — Project Work Summary")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(12)
    run_sub = p_sub.add_run("University Facility Management & Autonomous Workforce Dispatch SaaS")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = COLOR_ACCENT

    # Meta card / Callout box
    meta_table = doc.add_table(rows=1, cols=1)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    meta_table.columns[0].width = Inches(7.0)
    cell = meta_table.cell(0, 0)
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    p_meta = cell.paragraphs[0]
    p_meta.paragraph_format.space_after = Pt(0)
    run_meta = p_meta.add_run("Status Baseline: Starting from Zero to Current Production Readiness\nRepository: thehatrixop/task-manager-CSJMU  |  Branch: main  |  Generated: November 19, 2026")
    run_meta.font.name = "Calibri"
    run_meta.font.size = Pt(9.5)
    run_meta.font.color.rgb = COLOR_MUTED

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Section 1: Executive Overview
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(4)
    run_h1 = h1.add_run("1. Executive Overview")
    run_h1.font.name = "Calibri"
    run_h1.font.size = Pt(14)
    run_h1.font.bold = True
    run_h1.font.color.rgb = COLOR_PRIMARY

    p_desc = doc.add_paragraph()
    p_desc.paragraph_format.space_after = Pt(8)
    run_desc = p_desc.add_run(
        "CampusFlow has been transformed from a single monolithic 5,000+ line prototype into an enterprise-ready, "
        "64-page SaaS web application. It connects students, faculty, hostel wardens, technicians, and administrators "
        "with real-time state synchronization, smart workforce matching, a 30-minute ticking SLA timer, and zero-config Vercel deployment."
    )
    run_desc.font.name = "Calibri"
    run_desc.font.size = Pt(10)
    run_desc.font.color.rgb = COLOR_DARK

    # Section 2: Key Milestones Delivered
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(10)
    h2.paragraph_format.space_after = Pt(4)
    run_h2 = h2.add_run("2. Work Delivered (From Zero to Now)")
    run_h2.font.name = "Calibri"
    run_h2.font.size = Pt(14)
    run_h2.font.bold = True
    run_h2.font.color.rgb = COLOR_PRIMARY

    milestones = [
        ("Modular Decomposition: ", "Decomposed the monolithic HTML bundle into 64 standalone pages partitioned across 6 roles, eliminating 653 KB of obsolete scratch files."),
        ("Anti-AI Slop Design System: ", "Eliminated neon glows and pill buttons in favor of executive slate (#0f172a), emerald (#059669), and tactile 8px/6px geometry with solid surface backgrounds."),
        ("Clean Zero-Mock Baseline: ", "Purged all hardcoded mock tickets. Dashboards start in a clean state with contextual empty states and live cross-tab BroadcastChannel reactivity."),
        ("Dual Verification Engine: ", "Student complaints require Hostel Warden verification before dispatch; Faculty complaints are granted autonomous auto-verification to bypass the queue."),
        ("User Request Lifecycle: ", "Students/faculty can edit details or retract unverified requests; approved work orders can be cancelled with mandatory audit justification."),
        ("YouTube-Style Search: ", "Replaced native browser prompt() popups with an in-website search bar featuring live floating suggestions, real-time ticket matching, and Ctrl+K shortcut."),
        ("Pinned Sidebar & Profile Dropdown: ", "Fixed the left navigation sidebar to the viewport (sticky top-0 h-screen) and clubbed Profile & Settings, Switch Role, and Sign Out into a top-right avatar menu."),
        ("Vercel Serverless Architecture: ", "Structured the repository with canonical public/ output and a pure JavaScript Express API gateway in api/index.js for error-free cloud deployment.")
    ]

    for title, desc in milestones:
        p_bullet = doc.add_paragraph(style='List Bullet')
        p_bullet.paragraph_format.space_after = Pt(3)
        r_title = p_bullet.add_run(title)
        r_title.font.name = "Calibri"
        r_title.font.size = Pt(9.5)
        r_title.font.bold = True
        r_title.font.color.rgb = COLOR_PRIMARY
        r_desc = p_bullet.add_run(desc)
        r_desc.font.name = "Calibri"
        r_desc.font.size = Pt(9.5)
        r_desc.font.color.rgb = COLOR_DARK

    # Section 3: Roles & Credentials
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(12)
    h3.paragraph_format.space_after = Pt(4)
    run_h3 = h3.add_run("3. Six Roles & Login Credentials")
    run_h3.font.name = "Calibri"
    run_h3.font.size = Pt(14)
    run_h3.font.bold = True
    run_h3.font.color.rgb = COLOR_PRIMARY

    p_pwd = doc.add_paragraph()
    p_pwd.paragraph_format.space_after = Pt(6)
    r_pwd = p_pwd.add_run("Universal Demo Password for all accounts: Campus@2026")
    r_pwd.font.name = "Calibri"
    r_pwd.font.size = Pt(10)
    r_pwd.font.bold = True
    r_pwd.font.color.rgb = COLOR_ACCENT

    table = doc.add_table(rows=7, cols=5)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(1.1), Inches(1.3), Inches(1.8), Inches(1.6), Inches(1.2)]
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

    headers = ["Role", "Persona Name", "Identifier / Email", "Operational Scope", "Local Portal"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h)
        run.font.name = "Calibri"
        run.font.size = Pt(9)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)

    data = [
        ("Student (user)", "Aarav Patel", "aarav.patel@eng.university.edu", "Requires Warden Queue verification", "/pages/user/overview.html"),
        ("Faculty (faculty)", "Prof. Ananya Sen", "prof.ananya@faculty.university.edu", "Auto-Verified fast-track dispatch", "/pages/faculty/overview.html"),
        ("Authority (authority)", "Dr. Ramesh Sharma", "ramesh.sharma@faculty.university.edu", "Warden verification queue & sign-off", "/pages/authority/overview.html"),
        ("Worker (worker)", "Rajesh Kumar", "rajesh.kumar@technician.university.edu", "30m ticking countdown & SLA lock-in", "/pages/worker/overview.html"),
        ("Admin (admin)", "Vikramaditya Rao", "vikram.rao@facilities.university.edu", "Campus-wide dispatch telemetry", "/pages/admin/overview.html"),
        ("Super Admin (super)", "Dr. Aris Thorne", "aris.thorne@governance.university.edu", "Assignment weights & SHA-256 logs", "/pages/super/overview.html")
    ]

    for row_idx, row_data in enumerate(data, start=1):
        bg = "FFFFFF" if row_idx % 2 != 0 else "F8FAFC"
        for col_idx, text in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(text)
            run.font.name = "Calibri"
            run.font.size = Pt(8.5)
            if col_idx == 0:
                run.font.bold = True
                run.font.color.rgb = COLOR_PRIMARY
            elif col_idx == 4:
                run.font.color.rgb = COLOR_ACCENT
            else:
                run.font.color.rgb = COLOR_DARK

    # Section 4: Data State & Execution
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(4)
    run_h4 = h4.add_run("4. Runtime Execution & Database State")
    run_h4.font.name = "Calibri"
    run_h4.font.size = Pt(14)
    run_h4.font.bold = True
    run_h4.font.color.rgb = COLOR_PRIMARY

    p_run = doc.add_paragraph()
    p_run.paragraph_format.space_after = Pt(4)
    r_run = p_run.add_run("• Local Execution: Run 'node server.js' to access the application on http://localhost:8080/.\n"
                          "• Active Storage: Browser localStorage (campusflow_complaints_clean_v1) and Express in-memory API.\n"
                          "• PostgreSQL Cloud Schema: Fully authored in database/supabase_schema.sql (5 tables, 4 enums, RLS policies). "
                          "Ready to connect anytime by setting NEXT_PUBLIC_SUPABASE_URL and Anon Key.")
    r_run.font.name = "Calibri"
    r_run.font.size = Pt(9.5)
    r_run.font.color.rgb = COLOR_DARK

    # Section 5: Recommended Next Steps
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(10)
    h5.paragraph_format.space_after = Pt(4)
    run_h5 = h5.add_run("5. Recommended Next Steps")
    run_h5.font.name = "Calibri"
    run_h5.font.size = Pt(14)
    run_h5.font.bold = True
    run_h5.font.color.rgb = COLOR_PRIMARY

    steps = [
        "Vercel Deployment: Project structure and public/ output directory are already configured for one-click deployment.",
        "Live Supabase Connection: Execute database/supabase_schema.sql on Supabase and plug keys into lib/supabaseClient.js.",
        "SMS/Push Dispatch: Optional integration with Twilio or FCM for mobile alerts during the 30-minute worker response window."
    ]
    for s in steps:
        p_step = doc.add_paragraph(style='List Bullet')
        p_step.paragraph_format.space_after = Pt(3)
        r_step = p_step.add_run(s)
        r_step.font.name = "Calibri"
        r_step.font.size = Pt(9.5)
        r_step.font.color.rgb = COLOR_DARK

    doc.save(output_path)
    print(f"DOCX created at {output_path}")

if __name__ == "__main__":
    docx_path = os.path.abspath("CampusFlow_Work_Summary.docx")
    create_docx(docx_path)
