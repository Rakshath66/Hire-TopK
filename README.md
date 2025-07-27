# 🚀 Hire Top K - Startup Team Builder — AI-Powered Candidate Selection App

An AI-driven **startup team selector** that scores 100+ job applicants and auto-picks the best 5-member team for a \$100M seed-stage startup — with full analytics, justification, and an interactive UI.

> ✅ Built with: `Next.js 14`, `TypeScript`, `TailwindCSS`, `React`, `Client-side Scoring Logic`

![GitHub Repo stars](https://img.shields.io/github/stars/rakshath66/startup-team-builder?style=social)
![GitHub forks](https://img.shields.io/github/forks/rakshath66/startup-team-builder?style=social)
![MIT License](https://img.shields.io/github/license/rakshath66/startup-team-builder)

---

## 📸 Preview

![App Screenshot](images/screenshot.png)

🧪 **Demo Coming Soon**

<!-- or add live link if hosted -->

---

## 🧠 Features

* 📥 Upload and process **JSON resume data**
* 🧮 Intelligent scoring algorithm (100-point scale)
* 🧑‍💼 Automatically selects **top 5-member team**
* 🌍 Ensures **geographic, role, and experience diversity**
* 📊 **Team analytics**, skill coverage, cost breakdown
* 🌙 Dark mode + responsive UI

---

## 📐 Scoring Algorithm Breakdown (100 Points)

| Category              | Max Points | Criteria                                                          |
| --------------------- | ---------- | ----------------------------------------------------------------- |
| 💻 Technical Skills   | 25 pts     | Key techs (React, Node, Java, etc), modernity, diversity          |
| 📈 Experience Quality | 25 pts     | Seniority across roles, cumulative experience score               |
| 🎓 Education          | 20 pts     | Degree level, top-tier institutions, GPA consideration            |
| 🧠 Leadership         | 15 pts     | CEO/Founder (15), Director/Manager (10), Team Lead (5)            |
| 💰 Cost Efficiency    | 15 pts     | Lower expected salary = higher score (capped formula-based logic) |

---

## 🔍 Team Selection Logic

* 🌍 **Geographic Diversity**: Max 2 members per region
* 🧑‍💼 **Role Balance**: Mix of tech + business members
* 🧓 **Experience Mix**: Blend of senior & junior talent
* 💸 **Budget Optimization**: Maximize value under cost constraints

---

## 💻 Tech Stack

| Layer      | Tech                                         |
| ---------- | -------------------------------------------- |
| Frontend   | **Next.js 14**, **React**, **TypeScript**    |
| Styling    | **TailwindCSS**, `next-themes` for dark mode |
| State Mgmt | **React Hooks**, in-memory state             |
| Deployment | (Optional) Vercel, Netlify, or local run     |

---

## 📥 Getting Started

### 🔧 Prerequisites

* Node.js v18+
* A valid `candidates.json` input file

---

### 🖥️ Local Installation

```bash
# 1. Clone this repo
git clone https://github.com/rakshath66/hire-top-k.git
cd hire-top-k

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

---

## 📁 Project Structure

```
startup-team-builder/
├── components/
│   └── CandidateCard.tsx
│   └── TeamAnalytics.tsx
├── pages/
│   └── index.tsx
├── public/
│   └── images/screenshot.png
├── utils/
│   └── scoring.ts
├── styles/
├── data/
│   └── example_candidates.json
└── README.md
```

---

## 📈 How It Works

```
JSON Input → Parse → Score Candidates → Select Optimal Team → Display Results
```

* Scores each candidate (tech, edu, experience, etc.)
* Sorts by score, filters for team diversity
* Optimizes for budget and role balance
* Displays team with full analytics

---

## 🔐 Data Format Example

```json
[
  {
    "name": "Jane Doe",
    "skills": ["React", "Node.js"],
    "education": "Master's",
    "institution": "MIT",
    "experience": ["Team Lead", "Software Engineer"],
    "region": "North America",
    "expected_salary": 130000
  },
  ...
]
```

Paste JSON directly into the app’s input section.

---

## ⭐ Highlights

* ⏱ Built from scratch in just **30 minutes**
* 🔢 Fully automated candidate scoring
* 🌍 Smart team-building algorithm
* 🌒 Dark/Light theme toggle
* 📱 Mobile responsive layout

---

## 📄 License

MIT © [Rakshath U Shetty](https://github.com/rakshath66)

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software... [rest of MIT license]
```

---

## 🛣️ Roadmap

### ✅ MVP (Complete)

* ⏱ 30-min build demo
* 🧠 Candidate scoring
* 📊 Team analytics panel

### 🧩 Next Features (Planned)

* 📂 Upload JSON from file (not just paste)
* 📉 Add radar/spider charts for skills
* 💡 Explainability panel (Why this candidate?)
* 📤 Export selected team as PDF

---

## 🤝 Contributing

Pull requests welcome!
Fork → Code → PR → 🎉

Please follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: added region diversity logic"
```

---

## 🙌 Thanks

If this project inspired you, give it a ⭐ on GitHub!
Feel free to fork it, contribute, or build your own variant!

---

### 👨‍💻 Built by [Rakshath U Shetty](https://www.linkedin.com/in/rakshathushetty/)
