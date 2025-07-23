import { Candidate } from '@/types/candidate';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SelectedTeamProps {
  selectedCandidates: Candidate[];
  onCandidateRemove: (candidate: Candidate) => void;
}

export default function SelectedTeam({ 
  selectedCandidates,
  onCandidateRemove
}: SelectedTeamProps) {
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
    <div>
      <Card className="p-4 mb-4">
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
      </Card>

      <div className="space-y-2">
        {selectedCandidates.map((candidate) => (
          <Card
            key={candidate.email}
            className="p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{candidate.name}</p>
              <p className="text-sm text-gray-500">
                {candidate.work_experiences[0]?.roleName}
              </p>
            </div>
            <button
              onClick={() => onCandidateRemove(candidate)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
} 