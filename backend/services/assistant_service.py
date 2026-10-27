from typing import Optional
from ..schemas.assistant import ChatRequest, ChatResponse
from .gemini_service import gemini_service

class AssistantService:
    @staticmethod
    def answer_query(request: ChatRequest, api_key: Optional[str] = None) -> ChatResponse:
        last_user_msg = ""
        for m in reversed(request.messages):
            if m.role == "user":
                last_user_msg = m.content
                break

        if gemini_service.is_live_available(api_key):
            prompt = f"""
You are an expert Civil Engineering Consultant, Master Builder, and Construction Technical Advisor.
Respond accurately to the user query with professional civil engineering knowledge, references to relevant building codes (OSHA, ACI, IS, Eurocode, IBC), and practical field guidance.

Conversation History:
"""
            for msg in request.messages[-6:]:
                prompt += f"\n{msg.role.upper()}: {msg.content}"

            prompt += """
Return strict JSON with this schema:
{
  "reply": "Comprehensive, technical, yet clear markdown-formatted answer with bullet points and code/math where appropriate",
  "references": ["Relevant code standard 1", "Engineering textbook/standard 2"],
  "suggested_followups": ["Followup question 1", "Followup question 2", "Followup question 3"]
}
"""
            live_data = gemini_service.generate_json_response(prompt=prompt, override_key=api_key)
            if live_data:
                try:
                    return ChatResponse(
                        reply=live_data.get("reply", ""),
                        references=live_data.get("references", []),
                        suggested_followups=live_data.get("suggested_followups", [])
                    )
                except Exception:
                    pass

        # Intelligent Domain Knowledge Engine
        query = last_user_msg.lower()

        if "curing" in query or "concrete" in query and "day" in query:
            return ChatResponse(
                reply="### Minimum Concrete Curing Durations & Best Practices\n\nAccording to **ACI 308R** and **IS 456:2000 (Clause 13.5)**:\n\n1. **Ordinary Portland Cement (OPC)**:\n   - Minimum **7 days** of moist curing under normal atmospheric conditions.\n   - In hot or dry weather conditions (ambient temp > 30°C or relative humidity < 50%), extend moist curing to at least **10 days**.\n\n2. **Blended / Mineral Admixtures (PPC / Fly Ash / Slag Cement)**:\n   - Slower pozzolanic hydration requires a minimum of **10 to 14 days**.\n\n3. **Recommended Curing Methods**:\n   - **Water Ponding**: Ideal for horizontal floor slabs and pavements.\n   - **Wet Burlap / Hessian Cloth**: Kept continuously damp for vertical columns and beam sides.\n   - **Liquid Membrane-Forming Compounds (ASTM C309)**: Crucial where water resources are restricted.",
                references=[
                    "ACI 308R-16: Guide to External Curing of Concrete",
                    "IS 456:2000: Plain and Reinforced Concrete - Code of Practice",
                    "ASTM C309: Standard Specification for Liquid Membrane-Forming Compounds"
                ],
                suggested_followups=[
                    "What are the consequences of premature drying on concrete durability?",
                    "How to test compressive strength using concrete test cubes?",
                    "What curing methods are best in winter/cold weather (<5°C)?"
                ]
            )
        elif "slump" in query:
            return ChatResponse(
                reply="### Concrete Slump Test (ASTM C143 / IS 1199)\n\nThe slump test measures the workability and consistency of fresh concrete before placement.\n\n#### Standard Recommended Slump Ranges by Element:\n- **Mass concrete foundations & footings**: `25 - 75 mm` (1 - 3 inches)\n- **Reinforced beams and structural columns**: `75 - 125 mm` (3 - 5 inches)\n- **Pumped concrete & congested rebar slabs**: `100 - 150 mm` (4 - 6 inches)\n- **Tremie pipe underwater concreting**: `150 - 200 mm` (6 - 8 inches)\n\n#### Slump Failure Types:\n- **True Slump**: Uniform subsidence (acceptable consistency).\n- **Shear Slump**: Half the cone shears off (indicates lack of cohesion or harsh mix).\n- **Collapse**: Complete liquefaction (excessive water-cement ratio).",
                references=[
                    "ASTM C143 / C143M: Standard Test Method for Slump of Hydraulic-Cement Concrete",
                    "BS EN 12350-2: Testing Fresh Concrete - Slump Test",
                    "IS 1199: Methods of Sampling and Analysis of Concrete"
                ],
                suggested_followups=[
                    "How to rectify a batch that arrives with inadequate slump on site?",
                    "What superplasticizer dosage is recommended for pumpable concrete?",
                    "What is the difference between slump test and flow table test?"
                ]
            )
        elif "trench" in query or "shoring" in query or "osha" in query:
            return ChatResponse(
                reply="### OSHA 1926 Subpart P: Excavation & Trenching Safety Mandates\n\nTrench collapses are one of the most hazardous construction occurrences. Follow these safety benchmarks:\n\n1. **Protective System Trigger Depth**:\n   - Any trench equal to or exceeding **5 feet (1.52 meters)** in depth **must** have an engineered protective system (sloping, benching, shoring, or trench shield).\n   - Trenches under 5 feet also require protection if inspection by a *Competent Person* indicates potential cave-in hazard.\n\n2. **Access and Egress (Ladders / Ramps)**:\n   - Trenches **4 feet (1.22 meters)** or deeper require ladders, stairways, or ramps located so that lateral worker travel does not exceed **25 feet (7.6 meters)**.\n\n3. **Spoil Pile Clearance**:\n   - Excavated material, tools, and heavy machinery must be kept at least **2 feet (0.6 meters)** back from the edge of the excavation lip.",
                references=[
                    "OSHA 29 CFR 1926 Subpart P: Excavations (1926.650 - 1926.652)",
                    "OSHA Technical Manual (OTM) Section V: Chapter 2 - Excavations: Hazard Recognition in Trenching",
                    "National Utility Contractors Association (NUCA) Trench Safety Manual"
                ],
                suggested_followups=[
                    "How to classify soil types (Type A, B, C) on the job site?",
                    "What are the requirements for daily competent person inspections?",
                    "How to calculate lateral earth pressures on trench shields?"
                ]
            )
        elif "mix" in query or "ratio" in query or "grade" in query:
            return ChatResponse(
                reply="### Standard Concrete Mix Design Proportions (Nominal Ratios)\n\nNominal volumetric ratios (Cement : Sand : Coarse Aggregate):\n\n| Grade | Characteristic 28-day Strength | Nominal Ratio | Max Water-Cement Ratio | Recommended Application |\n| :--- | :--- | :--- | :--- | :--- |\n| **M10** | 10 N/mm² (1450 psi) | `1 : 3 : 6` | 0.60 | Plain cement concrete (PCC) leveling bed |\n| **M15** | 15 N/mm² (2175 psi) | `1 : 2 : 4` | 0.55 | Pathways, non-structural beddings |\n| **M20** | 20 N/mm² (2900 psi) | `1 : 1.5 : 3` | 0.50 | General reinforced concrete (RCC) slabs & footings |\n| **M25** | 25 N/mm² (3625 psi) | `1 : 1 : 2` | 0.45 | Heavy-duty structural columns & primary beams |\n| **M30 - M50** | 30 - 50 N/mm² | **Design Mix Only** (IS 10262 / ACI 211) | 0.38 - 0.42 | High-rise columns, post-tensioned girders |\n\n*Note: For all primary structural components, engineered design mix proportioning based on aggregate gradation and moisture compensation is mandatory.*",
                references=[
                    "IS 10262:2019: Concrete Mix Proportioning - Guidelines",
                    "ACI 211.1: Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete",
                    "BS EN 206: Concrete - Specification, Performance, Production and Conformity"
                ],
                suggested_followups=[
                    "How to conduct aggregate sieve analysis and moisture correction?",
                    "What is the role of silica fume in high-performance concrete?",
                    "How to prevent alkali-silica reaction (ASR) in concrete?"
                ]
            )
        else:
            return ChatResponse(
                reply=f"### Civil Engineering & Construction Advisory Response\n\nRegarding your inquiry: **\"{last_user_msg}\"**\n\nIn modern civil engineering management, addressing this requires attention to three fundamental pillars:\n\n1. **Quality & Structural Compliance**:\n   - Adhere strictly to project technical specifications, relevant building bylaws, and ASTM/ACI/IS material standards.\n   - Implement mandatory hold points for inspection before proceeding to subsequent work packages.\n\n2. **Jobsite Safety & Risk Control**:\n   - Enforce mandatory PPE protocols and conduct regular Job Safety Analyses (JSA) prior to critical operations.\n   - Ensure adequate temporary shoring and weather-defense contingencies are in place.\n\n3. **Schedule & Cost Performance (EVM)**:\n   - Track physical progress against the baseline Work Breakdown Structure (WBS).\n   - Closely monitor Schedule Performance Index ($SPI = \\frac{EV}{PV}$) and Cost Performance Index ($CPI = \\frac{EV}{AC}$) to mitigate potential delays.\n\nFeel free to ask for specific code formulas, structural calculations, or site inspection checklists!",
                references=[
                    "Project Management Institute (PMI) Construction Extension to the PMBOK Guide",
                    "International Building Code (IBC 2024)",
                    "FIDIC Conditions of Contract for Construction (Red Book)"
                ],
                suggested_followups=[
                    "What are the minimum curing requirements for high-strength concrete?",
                    "How to set up a Work Breakdown Structure (WBS) for residential projects?",
                    "What are the critical OSHA safety rules for working at heights?"
                ]
            )

assistant_service = AssistantService()
