const { useState } = React;

// Scoring constants
const MODERN_TECH_STACK = [
  'react', 'next.js', 'typescript', 'node.js', 'python',
  'aws', 'docker', 'kubernetes', 'graphql', 'rust'
];

const TOP_COMPANIES = [
  'google', 'amazon', 'meta', 'microsoft', 'apple',
  'netflix', 'uber', 'airbnb', 'stripe', 'coinbase'
];

// Scoring functions
function calculateTechnicalScore(candidate) {
  const skills = candidate.skills.map(skill => skill.toLowerCase());
  const modernTechCount = MODERN_TECH_STACK.filter(tech => 
    skills.some(skill => skill.includes(tech))
  ).length;
  return (modernTechCount / MODERN_TECH_STACK.length) * 25;
}

function calculateExperienceScore(candidate) {
  const experiences = candidate.work_experiences;
  if (!experiences.length) return 0;

  const topCompanyScore = experiences.reduce((score, exp) => {
    const isTopCompany = TOP_COMPANIES.some(company => 
      exp.company.toLowerCase().includes(company)
    );
    return score + (isTopCompany ? 12.5 : 5);
  }, 0);

  return Math.min(topCompanyScore, 25);
}

function calculateEducationScore(candidate) {
  const { education } = candidate;
  let score = 0;

  switch (education.highest_level.toLowerCase()) {
    case 'phd': score += 10; break;
    case 'masters': score += 8; break;
    case 'bachelors': score += 6; break;
    default: score += 2;
  }

  const bestDegree = education.degrees.reduce((best, current) => {
    if (!best) return current;
    return current.gpa > best.gpa ? current : best;
  }, education.degrees[0]);

  if (bestDegree) {
    if (bestDegree.isTop50) score += 5;
    if (bestDegree.gpa >= 3.5) score += 5;
  }

  return score;
}

function calculateLeadershipScore(candidate) {
  const leadershipKeywords = ['lead', 'manager', 'director', 'founder', 'cto', 'ceo'];
  const experiences = candidate.work_experiences;
  
  const hasLeadershipRole = experiences.some(exp => 
    leadershipKeywords.some(keyword => 
      exp.roleName.toLowerCase().includes(keyword)
    )
  );

  return hasLeadershipRole ? 15 : 7.5;
}

function calculateValueScore(candidate) {
  const salary = parseInt(candidate.annual_salary_expectation['full-time'].replace(/[^0-9]/g, ''));
  const maxReasonableSalary = 200000;
  
  if (salary <= maxReasonableSalary) {
    return 15;
  }
  
  const score = 15 * (maxReasonableSalary / salary);
  return Math.max(score, 5);
}

function calculateCandidateScores(candidates) {
  return candidates.map(candidate => ({
    ...candidate,
    score: {
      technical: calculateTechnicalScore(candidate),
      experience: calculateExperienceScore(candidate),
      education: calculateEducationScore(candidate),
      leadership: calculateLeadershipScore(candidate),
      value: calculateValueScore(candidate),
      total: 0
    }
  })).map(candidate => ({
    ...candidate,
    score: {
      ...candidate.score,
      total: Object.values(candidate.score).reduce((sum, score) => sum + score, 0) / 6
    }
  }));
}

// Components
function CandidateCard({ candidate, isSelected, onClick }) {
  return (
    <div 
      className={`p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer ${
        isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{candidate.name}</h3>
          <p className="text-sm text-gray-500">{candidate.location}</p>
        </div>
        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
          Score: {candidate.score.total.toFixed(1)}
        </span>
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-600">
          {candidate.work_experiences[0]?.roleName} at {candidate.work_experiences[0]?.company}
        </p>
        <p className="text-sm text-gray-600">
          {candidate.education.highest_level} - {candidate.education.degrees[0]?.school}
        </p>
      </div>

      <div className="flex flex-wrap gap-1">
        {candidate.skills.slice(0, 5).map((skill) => (
          <span key={skill} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 5 && (
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            +{candidate.skills.length - 5}
          </span>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Expected: {candidate.annual_salary_expectation['full-time']}
      </div>
    </div>
  );
}

function TeamAnalytics({ selectedCandidates }) {
  const totalSalary = selectedCandidates.reduce((sum, candidate) => {
    const salary = parseInt(candidate.annual_salary_expectation['full-time'].replace(/[^0-9]/g, ''));
    return sum + salary;
  }, 0);

  const uniqueSkills = new Set(
    selectedCandidates.flatMap(candidate => candidate.skills)
  );

  const regions = new Set(
    selectedCandidates.map(candidate => candidate.location)
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow mb-4">
      <h3 className="font-semibold mb-2">Team Analytics</h3>
      <div className="space-y-2">
        <p className="text-sm">
          Total Annual Cost: ${totalSalary.toLocaleString()}
        </p>
        <p className="text-sm">
          Skill Coverage: {uniqueSkills.size} unique skills
        </p>
        <p className="text-sm">
          Geographic Diversity: {regions.size} regions
        </p>
      </div>
    </div>
  );
}

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [jsonInput, setJsonInput] = useState('');

  const handleJsonSubmit = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const scoredCandidates = calculateCandidateScores(parsedData);
      setCandidates(scoredCandidates);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handleCandidateSelect = (candidate) => {
    if (selectedCandidates.length >= 5 && !selectedCandidates.includes(candidate)) {
      alert('You can only select 5 team members');
      return;
    }
    
    if (selectedCandidates.includes(candidate)) {
      setSelectedCandidates(selectedCandidates.filter(c => c !== candidate));
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Startup Team Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Import Candidates</h2>
          <textarea
            placeholder="Paste your JSON data here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-40 p-2 border rounded mb-4"
          />
          <button
            onClick={handleJsonSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load Candidates
          </button>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Selected Team ({selectedCandidates.length}/5)</h2>
          <TeamAnalytics selectedCandidates={selectedCandidates} />
          <div className="space-y-2">
            {selectedCandidates.map((candidate) => (
              <div
                key={candidate.email}
                className="p-3 bg-white rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-gray-500">
                    {candidate.work_experiences[0]?.roleName}
                  </p>
                </div>
                <button
                  onClick={() => handleCandidateSelect(candidate)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.email}
            candidate={candidate}
            isSelected={selectedCandidates.includes(candidate)}
            onClick={() => handleCandidateSelect(candidate)}
          />
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root')); 