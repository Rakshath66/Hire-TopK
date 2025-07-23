import { Candidate } from '@/types/candidate';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CandidateListProps {
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  onCandidateSelect: (candidate: Candidate) => void;
}

export default function CandidateList({ 
  candidates, 
  selectedCandidates, 
  onCandidateSelect 
}: CandidateListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidates.map((candidate) => (
        <Card
          key={candidate.email}
          className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${
            selectedCandidates.includes(candidate) ? 'border-2 border-blue-500' : ''
          }`}
          onClick={() => onCandidateSelect(candidate)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <p className="text-sm text-gray-500">{candidate.location}</p>
            </div>
            <Badge variant="secondary">
              Score: {candidate.score?.total.toFixed(1)}
            </Badge>
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
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 5 && (
              <Badge variant="outline">+{candidate.skills.length - 5}</Badge>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Expected: {candidate.annual_salary_expectation['full-time']}
          </div>
        </Card>
      ))}
    </div>
  );
} 