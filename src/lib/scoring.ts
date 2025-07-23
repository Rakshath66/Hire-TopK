import { Candidate } from '@/types/candidate';

const TECH_SKILLS = ['react', 'node', 'python', 'java', 'aws'];
const LEADERSHIP_ROLES = {
  'ceo': 15,
  'founder': 15,
  'director': 10,
  'manager': 10,
  'lead': 5
};

export function calculateScores(candidates: Candidate[]): Candidate[] {
  return candidates.map(candidate => ({
    ...candidate,
    scores: {
      technical: calculateTechnicalScore(candidate),
      experience: calculateExperienceScore(candidate),
      education: calculateEducationScore(candidate),
      leadership: calculateLeadershipScore(candidate),
      costEfficiency: calculateCostEfficiencyScore(candidate),
      total: 0
    }
  })).map(candidate => ({
    ...candidate,
    scores: {
      ...candidate.scores!,
      total: calculateTotalScore(candidate.scores!)
    }
  }));
}

function calculateTechnicalScore(candidate: Candidate): number {
  const skills = candidate.skills.map(s => s.toLowerCase());
  return TECH_SKILLS.reduce((score, skill) => 
    score + (skills.some(s => s.includes(skill)) ? 5 : 0), 0
  );
}

function calculateExperienceScore(candidate: Candidate): number {
  return candidate.work_experiences.reduce((score, exp) => {
    const role = exp.roleName.toLowerCase();
    return score + (role.includes('senior') || role.includes('director') || role.includes('manager') ? 5 : 3);
  }, 0);
}

function calculateEducationScore(candidate: Candidate): number {
  let score = 0;
  const level = candidate.education.highest_level.toLowerCase();
  
  if (level.includes('master') || level.includes('phd')) {
    score = 20;
  } else if (level.includes('bachelor')) {
    score = 15;
  } else if (level.includes('associate')) {
    score = 10;
  }

  if (candidate.education.degrees.some(d => d.isTop50)) {
    score += 5;
  }

  return Math.min(score, 25);
}

function calculateLeadershipScore(candidate: Candidate): number {
  return candidate.work_experiences.reduce((score, exp) => {
    const role = exp.roleName.toLowerCase();
    for (const [key, points] of Object.entries(LEADERSHIP_ROLES)) {
      if (role.includes(key)) {
        return Math.max(score, points);
      }
    }
    return score;
  }, 0);
}

function calculateCostEfficiencyScore(candidate: Candidate): number {
  const salary = parseInt(candidate.annual_salary_expectation['full-time'].replace(/[^0-9]/g, ''));
  const score = (150000 - salary) / 10000;
  return Math.min(Math.max(score, 0), 15);
}

function calculateTotalScore(scores: NonNullable<Candidate['scores']>): number {
  const { total, ...individualScores } = scores;
  return Object.values(individualScores).reduce((sum, score) => sum + score, 0);
}

export function selectTeam(candidates: Candidate[]): Candidate[] {
  const sortedCandidates = [...candidates].sort((a, b) => 
    (b.scores?.total || 0) - (a.scores?.total || 0)
  );

  const team: Candidate[] = [];
  const locations = new Set<string>();
  let hasTechnical = false;
  let hasBusiness = false;

  for (const candidate of sortedCandidates) {
    if (team.length >= 5) break;

    const location = candidate.location;
    const skills = candidate.skills.map(s => s.toLowerCase());
    const role = candidate.work_experiences[0]?.roleName.toLowerCase() || '';

    const isTechnical = TECH_SKILLS.some(skill => skills.some(s => s.includes(skill)));
    const isBusiness = role.includes('manager') || role.includes('director') || role.includes('ceo');

    if (locations.has(location) && locations.size >= 2) continue;

    if (!hasTechnical && isTechnical) {
      team.push(candidate);
      locations.add(location);
      hasTechnical = true;
      continue;
    }

    if (!hasBusiness && isBusiness) {
      team.push(candidate);
      locations.add(location);
      hasBusiness = true;
      continue;
    }

    if (team.length < 5) {
      team.push(candidate);
      locations.add(location);
    }
  }

  return team;
} 