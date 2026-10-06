# 🤖 FactCheckAI

> An AI-powered fact-checking web application that researches claims using real web sources, evaluates evidence, and generates an explainable verdict.

FactCheckAI is a full-stack AI fact-checking application built to explore how modern LLM-based research systems can be combined with web search, structured evidence extraction, workflow orchestration, authentication, and persistent storage.

Users can submit a claim, and the system automatically researches the claim using **Tavily**, extracts relevant evidence, checks whether the available evidence is sufficient, and then uses **Gemini** to generate a final verdict and explanation.

The application also provides source-level evidence, user-specific fact-check history, authentication, and detailed fact-check reports.

---

## 🌐 Live Demo

### Frontend

**AI FactCheck Web App**

https://ai-fact-check-92dv.vercel.app/

### Backend API

**FastAPI Backend**

https://ai-fact-check-772r.onrender.com

### API Documentation

The backend exposes interactive Swagger API documentation at:

`/docs`

For example:

```text
https://ai-fact-check-772r.onrender.com/docs
```

---

## ✨ Features

- 🔐 User registration and login
- 🔑 JWT-based authentication
- 🛡️ Protected user routes
- 🧠 AI-powered claim analysis
- 🔎 Automatic web research with Tavily
- 📝 AI-generated search queries
- 📚 Evidence extraction from web sources
- ⚖️ Supporting and contradicting evidence classification
- 🔄 Evidence sufficiency checking
- 🔍 Iterative search when evidence is insufficient
- 🤖 Gemini-powered verdict generation
- 📊 Verdict explanation
- 🔗 Source tracking
- 💾 PostgreSQL persistence
- 🕒 User-specific fact-check history
- 🗑️ Delete previous fact checks
- 📄 Detailed fact-check report pages
- 🎨 Modern dark-themed UI
- 🚀 Deployed frontend and backend

---

## 🖼️ Screenshots

Screenshots will be added to the `assets/` directory.

### Home / Fact Check

![FactCheckAI Home](assets/home.png)

### Login

![Login Page](assets/login.png)

### Register

![Register Page](assets/register.png)

### Fact Check Result

![Fact Check Result](assets/result.png)

### History

![Fact Check History](assets/history.png)

### Fact Check Details

![Fact Check Details](assets/details.png)

> Replace the placeholder image files above with your actual screenshots inside the `assets/` folder.

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Next.js Frontend   │
                         │   React + TypeScript │
                         │       Tailwind       │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │    FastAPI Backend   │
                         │                      │
                         │ Authentication       │
                         │ Fact Check API       │
                         │ History API          │
                         │ Source Management    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     LangGraph        │
                         │   Fact Check Agent   │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐  ┌────────────────┐  ┌───────────────┐
        │     Gemini     │  │     Tavily     │  │  PostgreSQL   │
        │      LLM       │  │  Web Search    │  │   Database    │
        └────────────────┘  └────────────────┘  └───────────────┘
```

---

# 🔄 How It Works

The application follows a multi-step research workflow rather than simply asking an LLM for a yes/no answer.

```text
User submits a claim
        │
        ▼
Claim Analysis
        │
        ▼
Generate Search Queries
        │
        ▼
Search the Web
        │
        ▼
Extract Evidence
        │
        ▼
Check Evidence Sufficiency
        │
        ├─────────────── Sufficient ───────────────┐
        │                                          │
        │                                          ▼
        │                                   Evaluate Evidence
        │                                          │
        │                                          ▼
        │                                   Generate Verdict
        │                                          │
        │                                          ▼
        │                                Save Fact Check
        │
        └──────────── Insufficient ───────► Refine Search
                                                   │
                                                   ▼
                                             Search Again
                                                   │
                                                   ▼
                                         Evaluate Evidence
```

The system can perform another search round when the available evidence is not sufficient.

This helps avoid relying on a single search result or immediately generating a verdict from weak evidence.

---

# 🧠 AI / LangGraph Workflow

The fact-checking pipeline is implemented using **LangGraph**.

## 1. Claim Analysis

The submitted claim is analyzed and converted into one or more search queries.

Example:

```text
Claim:
"The Earth is flat."

Generated searches:
- scientific evidence Earth shape
- satellite images Earth curvature
- Earth's shape scientific consensus
```

---

## 2. Web Search

The generated queries are sent to **Tavily** to retrieve relevant web sources.

The application collects information such as:

- Source title
- Source URL
- Search snippet
- Relevant content

---

## 3. Evidence Extraction

The LLM examines the retrieved sources and extracts evidence relevant to the original claim.

Each evidence item contains:

```text
source_url
evidence
relationship
```

The relationship can be:

```text
supports
contradicts
insufficient
```

---

## 4. Evidence Sufficiency Check

Before producing the final verdict, the system evaluates whether the collected evidence is sufficient.

The result contains:

```text
sufficient: true / false
reason: explanation
```

If the evidence is insufficient, the workflow can refine the search queries and perform another search round.

---

## 5. Evidence Evaluation

Once enough evidence has been collected, the evidence is evaluated together.

The system considers both supporting and contradicting evidence instead of relying on a single source.

---

## 6. Final Verdict

The final verdict is generated by Gemini.

Possible verdicts are:

```text
true
false
partially_true
insufficient_evidence
```

The application also generates a natural-language explanation describing why the verdict was reached.

---

# 🧩 LangGraph Nodes

The main workflow contains the following nodes:

| Node | Responsibility |
|---|---|
| `analyze_claim` | Understand the claim and generate search queries |
| `search_web` | Search the web using Tavily |
| `extract_evidence` | Extract relevant evidence from sources |
| `check_evidence_sufficiency` | Determine whether enough evidence exists |
| `refine_search_queries` | Generate improved queries when evidence is insufficient |
| `evaluate_evidence` | Evaluate the collected evidence and generate the verdict |

The workflow uses conditional routing to determine whether another search round is necessary.

---

# 🛠️ Tech Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

## Backend

- **Python**
- **FastAPI**
- **SQLAlchemy**
- **Alembic**

## AI

- **Google Gemini**
- **LangChain**
- **LangGraph**

## Web Search

- **Tavily**

## Database

- **PostgreSQL**

## Authentication

- **JWT**
- **Argon2 password hashing**

## Deployment

- **Vercel** — Frontend
- **Render** — Backend
- **PostgreSQL** — Database

---

# 🗄️ Database Design

The application currently uses three main database entities.

## Users

Stores registered users.

```text
users
├── id
├── email
├── password_hash
└── created_at
```

---

## Fact Checks

Stores the fact-check result associated with a user.

```text
fact_checks
├── id
├── user_id
├── claim
├── verdict
├── explanation
└── created_at
```

---

## Sources

Stores the sources and extracted evidence associated with a fact check.

```text
sources
├── id
├── fact_check_id
├── title
├── url
├── snippet
├── evidence
└── source_relationship
```

### Relationships

```text
User
 │
 │ 1
 │
 └──────────< FactCheck
                 │
                 │ 1
                 │
                 └──────────< Source
```

One user can have multiple fact checks.

One fact check can contain multiple sources.

---

# 🔐 Authentication

Authentication is implemented using JWT.

### Registration

```text
POST /auth/register
```

Creates a new user and securely hashes the password using Argon2.

### Login

```text
POST /auth/login
```

Validates the user's credentials and returns a JWT access token.

### Current User

```text
GET /auth/me
```

Returns the currently authenticated user.

Protected API endpoints require the JWT token:

```text
Authorization: Bearer <token>
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/auth/me` | Get current authenticated user |

## Fact Checks

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/fact-checks` | Run a new fact check |
| `GET` | `/fact-checks` | Get current user's history |
| `GET` | `/fact-checks/{id}` | Get a specific fact check |
| `DELETE` | `/fact-checks/{id}` | Delete a fact check |

Interactive API documentation is available through FastAPI Swagger UI at:

```text
https://ai-fact-check-772r.onrender.com/docs
```

---

# 🚀 Running Locally

## Prerequisites

Make sure you have:

- Python 3.12+
- Node.js
- PostgreSQL
- Git
- Gemini API key
- Tavily API key

---

# ⚙️ Backend Setup

Clone the repository:

```bash
git clone https://github.com/Priyanshu-010/AI-fact-check.git
```

Move into the project:

```bash
cd AI-fact-check/backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Backend Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/factcheck_ai

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Never commit your `.env` file.

---

## Database Migration

Run the Alembic migrations:

```bash
alembic upgrade head
```

---

## Start the Backend

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open a new terminal:

```bash
cd AI-fact-check/frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

---

# 📁 Project Structure

```text
AI-fact-check/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── graph.py
│   │   │   ├── llm.py
│   │   │   └── ...
│   │   │
│   │   ├── api/
│   │   │   └── dependencies.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── fact_check.py
│   │   │   └── source.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── fact_checks.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   └── fact_check.py
│   │   │
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   │
│   │   ├── history/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── page.tsx
│   │   └── layout.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── assets/
│   ├── home.png
│   ├── login.png
│   ├── register.png
│   ├── result.png
│   ├── history.png
│   └── details.png
│
├── .gitignore
└── README.md
```

> The exact project structure may evolve as the application continues to be improved.

---

# 🌍 Deployment

## Frontend

The Next.js frontend is deployed using **Vercel**.

Production environment variable:

```env
NEXT_PUBLIC_API_URL=https://ai-fact-check-772r.onrender.com
```

---

## Backend

The FastAPI backend is deployed using **Render**.

Production start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

The backend uses:

```text
postgresql+asyncpg
```

for asynchronous PostgreSQL connectivity.

Alembic migrations are executed during the Render build process.

---

# 🔒 Environment Variables

## Backend

```env
DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
GEMINI_API_KEY=
TAVILY_API_KEY=
```

## Frontend

```env
NEXT_PUBLIC_API_URL=
```

Never commit API keys, database passwords, JWT secrets, or `.env` files to GitHub.

---

# 🧪 Example

### Input

```text
The Earth is flat.
```

### Research

The application generates relevant search queries and searches the web using Tavily.

### Evidence

The system extracts evidence from multiple sources and classifies the relationship of the evidence to the claim.

```text
Source A → contradicts
Source B → contradicts
Source C → contradicts
```

### Final Result

```text
Verdict: False
```

The application then generates an explanation based on the collected evidence and stores the result in PostgreSQL.

---

# 🎯 Why I Built This

This project was built to understand how a real-world AI application can combine several different technologies into one working system.

Instead of using an LLM as a simple chatbot, the project explores a more structured workflow:

```text
LLM
 ↓
Search
 ↓
Evidence
 ↓
Evidence Validation
 ↓
Additional Research
 ↓
Evaluation
 ↓
Final Answer
```

The project also provided hands-on experience with:

- REST API development
- Authentication
- Database design
- SQLAlchemy
- Alembic migrations
- Async Python
- LangChain
- LangGraph
- LLM structured outputs
- Web search APIs
- Evidence extraction
- Next.js
- TypeScript
- API integration
- Protected frontend routes
- Deployment
- Production environment configuration
- CORS
- Error handling

---

# 🔮 Future Improvements

Possible future improvements include:

- Better source credibility scoring
- More sophisticated evidence ranking
- More robust source deduplication
- Additional search rounds when required
- Improved handling of conflicting sources
- Streaming AI responses
- More detailed fact-check analytics
- Better mobile responsiveness
- Automated tests
- Docker-based development and deployment
- Improved observability and logging
- More advanced fact-checking workflows

These features are intentionally not included yet so that the current system remains understandable and maintainable.

---

# 📌 Project Status

**Current status: Production deployed 🚀**

The application currently supports:

- User authentication
- Protected fact checking
- AI-powered web research
- Evidence extraction
- Evidence sufficiency checking
- Iterative search
- Verdict generation
- PostgreSQL persistence
- Fact-check history
- Source details
- Deletion
- Production deployment

---

# 👨‍💻 Author

**Priyanshu Rai**

### GitHub

https://github.com/Priyanshu-010

### LinkedIn

https://www.linkedin.com/in/priyanshuraidev/

### Email

priyanshurai2772@gmail.com

---

# ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is intended as a portfolio and learning project.