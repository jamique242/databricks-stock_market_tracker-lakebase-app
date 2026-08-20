# NBC Analytics Engineer Interview — Quick Talking Guide

## Interview Objective

Keep the conversation naturally moving through:

**My background → Current production work → Technical depth → Problem solving → dbt transition → Fit → My questions**

The central message:

> **I already work in production analytics engineering. NBC's environment would deepen that experience, particularly through dbt.**

---

# 1. OPENING — WHO I AM

### My positioning

> "My background started more heavily on the BI and analytics side, but over the last several years my role has evolved into much more hands-on analytics engineering. At CHEP, I support our finance analytics environment in Databricks, working with SQL, PySpark, production pipelines and data models. I support roughly 20 production fact tables and 15 Type 2 dimensions, and I work across development, deployment and production troubleshooting."

### Emphasize

- 7+ years across BI, databases, analytics and engineering
- Current work is increasingly **engineering-focused**, not just reporting
- Databricks + SQL + PySpark
- Production fact/dimension models
- AWS/S3 exposure
- Git/Bitbucket + CI/CD
- Dev → staging → production
- Data ultimately supports finance KPIs and downstream analytics

### If asked about Power BI

> "Power BI is still part of my role, but I increasingly work on the production data layer underneath the reporting."

**Goal:** Establish that I'm an **Analytics Engineer with BI roots**, not a BI analyst trying to become one.

---

# 2. CURRENT ROLE — HOW THE DATA WORKS

### Explain my environment simply

**SAP / SharePoint / Internal Production Data**  
↓  
**Databricks**  
↓  
**SQL + PySpark**  
↓  
**Delta / Production Models**  
↓  
**Scheduled Databricks Jobs**  
↓  
**Finance KPIs / Power BI**

### Talking points

- Build and maintain production pipelines
- Transform data using SQL and PySpark
- Work with Delta datasets
- Maintain approximately **20 fact tables + 15 Type 2 dimensions**
- Schedule Databricks jobs
- Promote changes through Dev → staging → production
- Validate outputs before/after deployment
- Troubleshoot failures when production workloads don't behave as expected

### Natural bridge

> "Because I'm working with production workloads, a big part of my job is also diagnosing issues when something changes or doesn't behave as expected."

→ This naturally leads into the production incident.

---

# 3. PRODUCTION TROUBLESHOOTING — `jq` INCIDENT

### Situation

Databricks deployment pipeline suddenly began failing.

**Important:** Deployment logic had not changed.

### What I found

- Initial error pointed toward a failed command/JSON parsing
- Traced the execution path backward through the logs
- Identified that `jq` was no longer available in the build environment
- Determined the likely issue was a change in the underlying build agent/runner environment

### Fix

- Added a dependency check before execution
- Automatically installed `jq` when needed
- Made the deployment less dependent on assumptions about the build environment

### Key lesson

> **"The error was the symptom; the missing dependency was the root cause."**

### What this demonstrates

**Production troubleshooting → Root-cause analysis → CI/CD → Dependency management → Prevention**

### If asked what I'd do differently

> "I'd want environment dependencies to be explicitly declared or validated rather than relying on utilities being present by default."

---

# 4. SQL / DATA QUALITY — LOSS EQUIPMENT OPTIMIZATION

### Situation

Optimized SQL supporting the **Loss Equipment in Network** table.

I found three issues:

### 1. Grain

- Joins were occurring at different grains
- This caused unintended row expansion

### 2. Filtering

- Filtering was inconsistent across CTEs
- Unnecessary data was being processed

### 3. Maintainability

- Business exceptions were hard-coded throughout the SQL

### What I did

- Examined the grain of each dataset
- Aligned the joins with the intended grain
- Standardized filtering
- Simplified exception handling
- Used **Databricks Query Profile** to understand execution/data movement
- Compared row counts throughout the transformation

### Validation

- Reduced unnecessary data movement
- Improved query performance
- Confirmed expected row counts
- Confirmed business results remained correct
- Made the SQL easier to maintain and troubleshoot

### Key phrase

> **"I wasn't just trying to make the query faster. I wanted to understand why it was inefficient and make sure the optimization didn't change the intended business result."**

### If asked about grain

> "Grain is essentially what one row represents. I want to establish that before joining datasets because joining different grains without controlling the relationship can unintentionally multiply records."

---

# 5. DATA MODELING — SHOW HOW I THINK

### Production experience

- ~20 Fact Tables
- ~15 Type 2 Dimensions

### My mental model

**Fact**

→ Business process/event at a defined grain, containing measures and keys.

**Dimension**

→ Descriptive business context used to analyze those facts.

**Type 2**

→ Preserve historical versions of dimensional attributes instead of overwriting history.

### Important connection

Modeling decisions affect:

- Join behavior
- Row counts
- Historical reporting
- KPI accuracy
- Query performance
- Downstream consumers

### Natural bridge

> "That's one of the things I like about analytics engineering — the work isn't just writing SQL. You're creating reliable models that other people and systems depend on."

---

# 6. COMPLEX SQL — ROLLING 12-MONTH KPI

Use this if she asks for another SQL example.

### Talking points

- Finance KPI requiring a continuously evaluated rolling period
- Used CTEs to break the logic into manageable stages
- Used partition/window-style calculations
- Designed the logic around the actual business reporting requirement
- Validated results against finance expectations
- Output supported downstream analytics/reporting

### Distinction

**Loss Equipment**  
→ SQL performance + data quality

**Rolling KPI**  
→ Complex business logic + SQL depth

---

# 7. HOW I APPROACH AN EXISTING CODEBASE

NBC is specifically looking for someone who can enter an established environment and become productive without immediately redesigning it.

### My approach

**Understand → Trace → Validate → Change**

1. Understand repository/project structure
2. Identify upstream sources
3. Trace dependencies
4. Understand model grain
5. Review existing tests/validation
6. Identify downstream consumers
7. Test safely in development
8. Follow established patterns before proposing changes

### Key statement

> **"Before changing an existing pattern, I want to understand why it exists and what depends on it."**

---

# 8. DBT — HANDLE THE GAP CONFIDENTLY

### If asked about production dbt

> "My day-to-day production transformation work is primarily Databricks, SQL and PySpark rather than dbt. I've worked with dbt through projects and understand models, sources, dependencies, testing and documentation, but I wouldn't represent that as extensive production dbt ownership."

### Immediately bridge

> "The underlying production practices are already familiar to me — building models, managing dependencies, validating outputs, version control, deployment and troubleshooting. The main transition for me would be learning how your team implements those practices through dbt."

### Know these concepts

- Models
- Sources
- `ref()`
- Tests
- Materializations
- Incremental models
- Macros/Jinja
- Documentation
- Lineage
- Git/PR workflow
- CI/CD

**Don't over-explain the gap. Acknowledge it → bridge it → move on.**

---

# 9. WHY THIS ROLE

### If asked "Why this position?"

> "It feels like a natural progression from the work I'm already doing. I'm already working with production models, SQL, Databricks, pipelines, deployment and troubleshooting. What I want to deepen is the analytics engineering side, particularly working within a mature dbt environment and taking more ownership of production models."

### Desired impression

> **"I'm not starting over. I'm moving deeper into the engineering side of work I'm already doing."**

---

# 10. THREE QUESTIONS TO ASK AT THE END

## 1. First 30–60 Days

> **"What would the first 30 to 60 days look like for someone coming into this role?"**

### Follow-up if the first 30–60 days are already discussed:

> **"Could you describe what a typical day-to-day looks like? And what are some of the higher-value or immediate-attention areas the team is currently working through?"**

### What I'm learning from this question

- What they expect me to own
- Current priorities
- Immediate pain points
- Whether the role matches the job description
- What success actually looks like

---

## 2. Data Engineering + Analytics Engineering

> **"How is the work divided between the Data Engineering team and the Analytics Engineering team, particularly around Databricks versus dbt? How much time would someone in this role typically spend working in each?"**

### Follow-up:

> **"And as that partnership evolves, what do you see as the future state of how the two teams will work together?"**

### If appropriate:

> **"Given the combination of Databricks, SQL, PySpark and production modeling experience I bring, how do you see someone with my skill set fitting into that team?"**

### What I'm learning from this question

- Where AE ends and DE begins
- How heavily the role actually relies on dbt
- How much Databricks work I'll retain
- Future team structure
- Where my current experience gives me immediate value

---

## 3. AI at NBC

> **"What is the current state of AI integration at NBC, particularly within the data organization? How is your team using AI in the day-to-day engineering workflow?"**

### Follow-up:

> **"Are there initiatives where the team is working directly with AI models or building AI-driven applications, agents, or workflows using APIs, MCP or other tool integrations?"**

### If the conversation goes deeper:

> **"Is the focus currently more on using AI to improve developer productivity, or are teams beginning to build AI capabilities into internal products and workflows?"**

### What I'm learning from this question

- Current AI adoption
- AI developer tooling
- Internal AI initiatives
- Whether AI agents/API/MCP work exists
- Potential future opportunities for me within the organization

---

# QUICK MENTAL MAP DURING THE INTERVIEW

### If she asks about...

**My background**  
→ Production Analytics Engineering

**Current role**  
→ Databricks → SQL/PySpark → Models → Finance

**Pipelines**  
→ Production → CI/CD → `jq` incident

**Troubleshooting**  
→ `jq` → Symptom vs. root cause

**SQL**  
→ Loss Equipment optimization

**Data quality**  
→ Grain → Row expansion → Validation

**Modeling**  
→ 20 facts + 15 Type 2 dimensions

**Complex SQL**  
→ Rolling 12-month KPI

**Existing codebase**  
→ Understand → Trace → Validate → Change

**dbt**  
→ Be transparent → Bridge from production Databricks experience

**Why NBC**  
→ Natural progression → Deeper Analytics Engineering

---

# ONE THING TO REMEMBER

Don't try to cover everything.

Let Catherine ask questions, then use your answers to naturally expose the next layer:

**Who I am**  
→ **What I build**  
→ **How I deploy it**  
→ **How I fix it when it breaks**  
→ **How I optimize it**  
→ **How I model data**  
→ **How I would transition into their dbt environment**  
→ **How my experience fits their future direction**

**The goal is to control the direction and depth of the conversation without making the interview feel scripted.**
