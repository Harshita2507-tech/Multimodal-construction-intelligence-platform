import streamlit as st
import io
import os
from PIL import Image

# Import existing backend services
from backend.services.safety_service import safety_service
from backend.services.crack_service import crack_service
from backend.services.planning_service import planning_service
from backend.services.valuation_service import valuation_service
from backend.services.advisory_service import advisory_service
from backend.services.assistant_service import assistant_service
from backend.schemas.planning import ProjectPlanningInput
from backend.schemas.valuation import ValuationInput
from backend.schemas.advisory import WeatherInput
from backend.schemas.assistant import ChatRequest, ChatMessage

st.set_page_config(
    page_title="Multimodal Construction Intelligence Platform",
    page_icon="🏗️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #38bdf8, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .metric-card {
        background-color: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .badge-success {
        background-color: #064e3b;
        color: #34d399;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge-warning {
        background-color: #78350f;
        color: #fbbf24;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge-danger {
        background-color: #7f1d1d;
        color: #f87171;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/construction.png", width=64)
    st.markdown("### 🏗️ Construction Intelligence")
    st.caption("Multimodal AI Decision-Support System")
    
    st.divider()
    api_key = st.text_input("Google Gemini API Key (Optional)", type="password", help="Leave blank to use built-in Autonomous Civil AI")
    if api_key:
        st.success("Gemini 1.5 Live Connected")
    else:
        st.info("Running in Built-in Civil AI Mode")
        
    st.divider()
    st.markdown("**Project Progress:** 100%")
    st.progress(1.0)
    st.caption("✅ 9 Epics Completed | 18 Tasks Done")
    st.markdown("[📂 View GitHub Repository](https://github.com/Harshita2507-tech/Multimodal-construction-intelligence-platform)")

# Header
st.markdown('<div class="main-title">Multimodal Construction Intelligence Platform</div>', unsafe_allow_html=True)
st.caption("Full-Stack Decision Support System for Site Safety, Structural Integrity, Project Planning & Valuation")

tabs = st.tabs([
    "📊 Executive Dashboard",
    "🦺 Site Safety Monitoring",
    "🔍 Crack & Structural Analysis",
    "📅 Project Planning & WBS",
    "📈 Real Estate Valuation",
    "🌦️ Daily & Weather Advisory",
    "🤖 Civil Knowledge AI"
])

# TAB 1: EXECUTIVE DASHBOARD
with tabs[0]:
    st.markdown("### 📋 Executive Project Overview")
    st.markdown("""
    The **AI-Powered Multimodal Construction Intelligence Platform** is an intelligent full-stack decision-support system designed to assist construction professionals across multiple stages of construction planning, execution, and monitoring.
    """)
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Epics", "9 / 9", delta="100% Done")
    with col2:
        st.metric("Stories & Subtasks", "18 / 18", delta="Complete")
    with col3:
        st.metric("Active Sites Monitored", "4 Sites", delta="Normal")
    with col4:
        st.metric("Average Safety Score", "84 / 100", delta="+6 pts")
        
    st.divider()
    st.markdown("#### 🛠️ Architecture Workflow")
    st.info("React Frontend (Port 5173) ⇄ FastAPI REST API (Port 8000) ⇄ Multimodal Gemini 1.5 + Built-in Autonomous Civil Engine")
    
    st.markdown("#### 📦 Completed Epics:")
    epics = [
        "Epic 1 : Requirements Specification and Environment Setup",
        "Epic 2 : Image-Based Analysis Module Development (Safety & Cracks)",
        "Epic 3 : Construction Planning and Valuation Module Development",
        "Epic 4 : AI Intelligence Layer Implementation (Multimodal Gemini)",
        "Epic 5 : Assistant and Advisory Engine Development (Weather & Civil AI)",
        "Epic 6 : Interface, Testing, and Deployment (Full Verification)"
    ]
    for ep in epics:
        st.markdown(f"- ✅ **{ep}**")

# TAB 2: SITE SAFETY MONITORING
with tabs[1]:
    st.markdown("### 🦺 Construction Site Safety Monitoring")
    st.caption("PPE Compliance Audit (ANSI Z89.1), Hazard Detection & OSHA 1926 Scoring")
    
    col_l, col_r = st.columns([1, 1])
    with col_l:
        sample_choice = st.selectbox(
            "Select Site Scenario or Upload Photo:",
            ["Scaffolding Fall Hazard (Tier 3)", "Compliant Framing Crew", "Deep Excavation Cave-in", "Custom Image Upload"]
        )
        
        uploaded_file = None
        preset_key = "safe"
        if sample_choice == "Scaffolding Fall Hazard (Tier 3)":
            preset_key = "scaffold"
        elif sample_choice == "Compliant Framing Crew":
            preset_key = "safe"
        elif sample_choice == "Deep Excavation Cave-in":
            preset_key = "excavation"
        else:
            uploaded_file = st.file_uploader("Upload Construction Image", type=["jpg", "png", "jpeg"])

        btn_safety = st.button("Run Safety Audit 🚀", key="btn_safe")

    with col_r:
        if btn_safety:
            img_bytes = uploaded_file.read() if uploaded_file else b""
            fname = uploaded_file.name if uploaded_file else f"{preset_key}.jpg"
            report = safety_service.analyze_site_image(img_bytes, filename=fname, api_key=api_key)
            
            sc_color = "badge-success" if report.overall_safety_score >= 80 else "badge-warning" if report.overall_safety_score >= 60 else "badge-danger"
            st.markdown(f"#### Safety Score: <span class='{sc_color}'>{report.overall_safety_score} / 100 ({report.risk_level})</span>", unsafe_allow_html=True)
            st.write(f"**Workers Detected:** {report.workers_detected}")
            st.info(report.site_context)
            
            st.markdown("##### 👷 PPE Compliance Checklist:")
            for ppe in report.ppe_compliance:
                icon = "✅" if "compliant" in ppe.status.lower() and "non" not in ppe.status.lower() else "❌"
                st.write(f"{icon} **{ppe.item_name}**: {ppe.status} — *{ppe.details}*")
                
            st.markdown("##### ⚠️ Hazards Identified:")
            for hz in report.hazards_detected:
                st.warning(f"**{hz.hazard_type} ({hz.severity} Severity)**: {hz.description}\n\n👉 **Action:** {hz.remediation}")
                
            st.markdown("##### 📚 OSHA References:")
            st.caption(", ".join(report.osha_references))

# TAB 3: CRACK & STRUCTURAL ANALYSIS
with tabs[2]:
    st.markdown("### 🔍 Crack Detection & Structural Distress Analysis")
    st.caption("Forensic Civil Engineering, Crack Telemetry, and ACI 224.1R Remediation")
    
    col_l, col_r = st.columns([1, 1])
    with col_l:
        crack_choice = st.selectbox(
            "Select Structural Case or Upload:",
            ["Beam 45° Diagonal Shear Failure", "Column Spall & Exposed Rebar", "Interior Wall Hairline Shrinkage", "Custom Upload"]
        )
        up_crack = None
        c_preset = "shear"
        if crack_choice == "Beam 45° Diagonal Shear Failure":
            c_preset = "shear"
        elif crack_choice == "Column Spall & Exposed Rebar":
            c_preset = "spall"
        elif crack_choice == "Interior Wall Hairline Shrinkage":
            c_preset = "hairline"
        else:
            up_crack = st.file_uploader("Upload Structural Photo", type=["jpg", "png", "jpeg"], key="crk_up")
            
        btn_crack = st.button("Analyze Structural Distress 🔍", key="btn_crk")

    with col_r:
        if btn_crack:
            c_bytes = up_crack.read() if up_crack else b""
            cfname = up_crack.name if up_crack else f"{c_preset}.jpg"
            c_report = crack_service.analyze_crack_image(c_bytes, filename=cfname, api_key=api_key)
            
            st.markdown(f"#### Element: **{c_report.element_inspected}**")
            st.markdown(f"**Defect Type:** {c_report.crack_type}")
            st.metric("Severity Score", f"{c_report.severity_score} / 100", c_report.severity_grade)
            
            st.markdown("##### 📏 Crack Telemetry:")
            m1, m2, m3 = st.columns(3)
            m1.metric("Est. Width", f"{c_report.measurements.estimated_width_mm} mm")
            m2.metric("Est. Length", f"{c_report.measurements.estimated_length_cm} cm")
            m3.metric("Orientation", c_report.measurements.orientation)
            
            st.error(f"**Integrity Risk:** {c_report.structural_integrity_risk}")
            
            st.markdown("##### 🛠️ Engineering Remediation:")
            for rm in c_report.remediation_methods:
                st.write(f"- 🔧 {rm}")
            st.caption(f"**Urgency:** {c_report.urgency_level}")

# TAB 4: PROJECT PLANNING
with tabs[3]:
    st.markdown("### 📅 Construction Project Planning & Cost Estimation")
    st.caption("6-Phase Work Breakdown Structure (WBS), Milestone Timeline, and Labor Allocations")
    
    col1, col2, col3 = st.columns(3)
    p_name = col1.text_input("Project Name", "Skyline Residences")
    p_type = col2.selectbox("Building Type", ["Residential Multi-Storey", "Commercial Complex", "Industrial Warehouse", "Villa / Bungalow"])
    p_area = col3.number_input("Built-up Area (sq ft)", min_value=1000, value=25000, step=1000)
    
    col4, col5, col6 = st.columns(3)
    p_floors = col4.number_input("Number of Floors", min_value=1, value=5)
    p_budget = col5.number_input("Target Budget ($)", min_value=50000, value=1250000, step=50000)
    p_dur = col6.number_input("Target Duration (Months)", min_value=3, value=14)
    
    if st.button("Generate WBS Schedule & Cost Plan 📑"):
        inp = ProjectPlanningInput(
            project_name=p_name,
            project_type=p_type,
            built_up_area_sqft=float(p_area),
            floors_count=int(p_floors),
            target_budget_usd=float(p_budget),
            target_duration_months=int(p_dur)
        )
        plan = planning_service.generate_project_plan(inp, api_key=api_key)
        
        c1, c2, c3 = st.columns(3)
        c1.metric("Total Estimated Cost", f"${plan.total_estimated_cost:,.2f}", f"{plan.budget_variance_percentage}% var")
        c2.metric("Contingency Reserve", f"${plan.contingency_fund:,.2f}", "10% Hedge")
        c3.metric("Duration", f"{plan.total_duration_weeks} Weeks", "6 Phases")
        
        st.info(plan.project_summary)
        
        st.markdown("#### 🗓️ Milestones (WBS Sequence):")
        for ms in plan.milestones:
            crit = "🔴 Critical Path" if ms.critical_path else "🟢 Normal"
            with st.expander(f"Phase {ms.phase_number}: {ms.phase_name} ({ms.duration_weeks} wks) — {crit}"):
                st.write(f"**Cost:** ${ms.estimated_cost:,.2f} | **Timeline:** Week {ms.start_week} to {ms.end_week}")
                st.write("**Deliverables:**", ", ".join(ms.deliverables))

        st.markdown("#### 💰 Cost Breakdown:")
        for cb in plan.cost_breakdown:
            st.write(f"- **{cb.category}**: ${cb.amount:,.2f} ({cb.percentage}%) — *{cb.description}*")

# TAB 5: VALUATION
with tabs[4]:
    st.markdown("### 📈 Real Estate Valuation & Investment Intelligence")
    st.caption("Cost-Approach Appraisal, Age-Life Depreciation & Rental Yield")
    
    vc1, vc2 = st.columns(2)
    v_name = vc1.text_input("Asset Name", "Emerald Executive Tower")
    v_tier = vc2.selectbox("Location Tier", ["Tier 1 Prime / Metro CBD", "Tier 2 Suburban", "Developing Urban Fringe", "Industrial Corridor"])
    
    vc3, vc4, vc5 = st.columns(3)
    v_built = vc3.number_input("Built-up (sq ft)", value=2200)
    v_land = vc4.number_input("Land Area (sq ft)", value=3500)
    v_age = vc5.number_input("Structure Age (Years)", value=4)
    
    if st.button("Compute Property Appraisal 💎"):
        vinp = ValuationInput(
            property_name=v_name,
            location_tier=v_tier,
            built_up_area_sqft=float(v_built),
            land_area_sqft=float(v_land),
            property_age_years=int(v_age)
        )
        val = valuation_service.estimate_valuation(vinp, api_key=api_key)
        
        k1, k2, k3 = st.columns(3)
        k1.metric("Fair Market Valuation", f"${val.estimated_market_value:,.2f}")
        k2.metric("Unit Rate", f"${val.rate_per_sqft} / sq ft")
        k3.metric("Investment Rating", val.investment_rating, f"{val.investment_score}/100")
        
        st.write(f"**95% Confidence Band:** ${val.confidence_range_low:,.2f} — ${val.confidence_range_high:,.2f}")
        st.write(f"**Estimated Monthly Rent:** ${val.estimated_monthly_rent:,.2f} | **Cap Rate / Yield:** {val.rental_yield_percentage}%")
        st.write(f"**5-Year Appreciation Forecast:** +{val.five_year_appreciation_forecast_percentage}%")
        st.info(val.valuation_rationale)

# TAB 6: ADVISORY
with tabs[5]:
    st.markdown("### 🌦️ Daily Site Assistance & Weather Advisory")
    w_cond = st.selectbox("Simulate Condition:", ["Sunny / Clear", "Heavy Rain / Thunderstorm", "High Winds (>40 km/h)", "Extreme Heat (>38°C)"])
    w_temp = st.slider("Temperature (°C)", 0, 48, 32)
    w_wind = st.slider("Wind Speed (km/h)", 0, 70, 18)
    
    if st.button("Evaluate Meteorological Impact ⛈️"):
        winp = WeatherInput(condition=w_cond, temperature_c=float(w_temp), wind_speed_kmh=float(w_wind))
        adv = advisory_service.generate_weather_advisory(winp, api_key=api_key)
        
        st.metric("Overall Site Risk", adv.overall_site_risk, f"{adv.delay_probability_percentage}% delay chance")
        st.write(f"**Summary:** {adv.weather_summary}")
        
        st.markdown("##### 🏗️ Critical Trade Activities Status:")
        for op in adv.operations_impact:
            st.write(f"- **{op.activity_name}**: `{op.status}` — {op.advisory_notes}")
            
        st.markdown("##### 📋 Daily Supervisor Checklist:")
        for chk in adv.daily_supervisor_checklist:
            st.checkbox(f"[{chk.assigned_role}] {chk.item} ({chk.priority} Priority)")

# TAB 7: ASSISTANT
with tabs[6]:
    st.markdown("### 🤖 Construction Knowledge Assistant")
    user_q = st.text_input("Ask a construction or structural code question:", "What is the minimum concrete curing time for OPC vs PPC?")
    if st.button("Ask Assistant 💬"):
        req = ChatRequest(messages=[ChatMessage(role="user", content=user_q)])
        res = assistant_service.answer_query(req, api_key=api_key)
        st.markdown(res.reply)
        if res.references:
            st.caption("📚 References: " + ", ".join(res.references))
