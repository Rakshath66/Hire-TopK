'use client';

import { useState } from 'react';
import { Candidate } from '@/types/candidate';
import { calculateScores, selectTeam } from '@/lib/scoring';
import { useTheme } from 'next-themes';

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Candidate[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [activeTab, setActiveTab] = useState('team');
  const [sortField, setSortField] = useState<keyof NonNullable<Candidate['scores']>>('total');
  const { theme, setTheme } = useTheme();

  const handleJsonSubmit = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const scoredCandidates = calculateScores(parsedData);
      setCandidates(scoredCandidates);
      const team = selectTeam(scoredCandidates);
      setSelectedTeam(team);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handleSort = (field: keyof NonNullable<Candidate['scores']>) => {
    setSortField(field);
    setCandidates([...candidates].sort((a, b) => 
      (b.scores?.[field] || 0) - (a.scores?.[field] || 0)
    ));
  };

  const totalSalary = selectedTeam.reduce((sum, candidate) => {
    const salary = parseInt(candidate.annual_salary_expectation['full-time'].replace(/[^0-9]/g, ''));
    return sum + salary;
  }, 0);

  const uniqueSkills = new Set(selectedTeam.flatMap(c => c.skills));
  const locations = new Set(selectedTeam.map(c => c.location));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-5xl mx-auto py-8 px-4 text-center relative">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="absolute right-4 top-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Startup Team Builder
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
            Select your top 5 candidates for your startup team
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 py-8 space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">Import Candidates</h2>
          <textarea
            placeholder="Paste your JSON data here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-40 p-2 border rounded mb-4 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <button
            onClick={handleJsonSubmit}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Load Candidates
          </button>
        </div>

        {candidates.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="border-b dark:border-gray-700">
              <nav className="flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('team')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'team'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Selected Team ({selectedTeam.length}/5)
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  All Candidates ({candidates.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'team' ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Annual Cost</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${totalSalary.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Skill Coverage</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{uniqueSkills.size} skills</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Geographic Diversity</p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{locations.size} regions</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedTeam.map((candidate) => (
                      <div
                        key={candidate.email}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{candidate.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{candidate.location}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {candidate.work_experiences[0]?.roleName} at {candidate.work_experiences[0]?.company}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {candidate.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 bg-white dark:bg-gray-600 rounded-full text-xs font-medium text-gray-600 dark:text-gray-200 shadow-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 3 && (
                                <span className="px-2.5 py-1 bg-white dark:bg-gray-600 rounded-full text-xs font-medium text-gray-600 dark:text-gray-200 shadow-sm">
                                  +{candidate.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              Score: {candidate.scores?.total.toFixed(1)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              {candidate.annual_salary_expectation['full-time']}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Location
                        </th>
                        {['technical', 'experience', 'education', 'leadership', 'costEfficiency', 'total'].map((field) => (
                          <th
                            key={field}
                            onClick={() => handleSort(field as keyof NonNullable<Candidate['scores']>)}
                            className="p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            {field === 'costEfficiency' ? 'Cost' : field}
                            {sortField === field && ' ↓'}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {candidates.map((candidate) => (
                        <tr
                          key={candidate.email}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            selectedTeam.includes(candidate) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {candidate.work_experiences[0]?.roleName}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">{candidate.location}</td>
                          <td className="p-4 text-center text-gray-600 dark:text-gray-300">{candidate.scores?.technical.toFixed(1)}</td>
                          <td className="p-4 text-center text-gray-600 dark:text-gray-300">{candidate.scores?.experience.toFixed(1)}</td>
                          <td className="p-4 text-center text-gray-600 dark:text-gray-300">{candidate.scores?.education.toFixed(1)}</td>
                          <td className="p-4 text-center text-gray-600 dark:text-gray-300">{candidate.scores?.leadership.toFixed(1)}</td>
                          <td className="p-4 text-center text-gray-600 dark:text-gray-300">{candidate.scores?.costEfficiency.toFixed(1)}</td>
                          <td className="p-4 text-center font-semibold text-gray-900 dark:text-white">{candidate.scores?.total.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 