
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Ranking {
  student_id: string;
  name: string | null;
  total_points: number;
  sessions_completed: number;
  quizzes_completed: number;
  rank: number;
  student_code?: string | null;
}

interface LeaderboardProps {
  rankings: Ranking[];
  currentUserId: string | undefined;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ rankings, currentUserId }) => {
  // Take the top 10 ranked students
  const topRankings = rankings.slice(0, 10);

  if (topRankings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-gray-500">No rankings available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-purple-50">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Student Leaderboard
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y">
          {topRankings.map((student) => (
            <div 
              key={student.student_id}
              className={cn(
                "flex items-center p-4",
                currentUserId === student.student_id ? "bg-blue-50" : ""
              )}
            >
              <div className="flex-shrink-0 w-12 flex justify-center items-center">
                {student.rank === 1 ? (
                  <Trophy className="h-7 w-7 text-yellow-500" />
                ) : student.rank === 2 ? (
                  <Award className="h-6 w-6 text-gray-400" />
                ) : student.rank === 3 ? (
                  <Medal className="h-6 w-6 text-amber-700" />
                ) : (
                  <div className="text-lg font-bold text-gray-500">#{student.rank}</div>
                )}
              </div>
              
              <div className="flex-grow mx-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {student.name || "Anonymous Student"}
                      {student.student_code && (
                        <span className="ml-2 text-xs text-gray-500">
                          (ID: {student.student_code})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.sessions_completed} sessions • {student.quizzes_completed} quizzes
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <div className="font-bold text-lg">{student.total_points}</div>
                <div className="text-xs text-gray-500">POINTS</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
