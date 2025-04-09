
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Trophy, User } from "lucide-react";

interface StudentRank {
  student_id: string;
  name: string | null;
  email: string | null;
  total_points: number;
  sessions_completed: number;
  quizzes_completed: number;
  rank: number;
}

interface LeaderboardProps {
  rankings: StudentRank[];
  currentUserId?: string;
  showAllRanks?: boolean;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Award className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-700" />;
    default:
      return <Star className="h-5 w-5 text-academy-blue" />;
  }
};

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  rankings, 
  currentUserId,
  showAllRanks = false 
}) => {
  return (
    <Card className="border-2 border-indigo-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Student Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-purple-50">
            <TableRow>
              <TableHead className="w-12 text-center">Rank</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="hidden md:table-cell text-right">Sessions</TableHead>
              <TableHead className="hidden md:table-cell text-right">Quizzes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((student) => (
              <TableRow 
                key={student.student_id}
                className={`${student.student_id === currentUserId ? "bg-purple-100" : ""} 
                           ${student.rank <= 3 ? "font-medium" : ""}`}
              >
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {getRankIcon(student.rank)}
                    <span className="sr-only">Rank {student.rank}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  <div className="bg-purple-100 rounded-full p-1">
                    <User className="h-4 w-4 text-purple-700" />
                  </div>
                  {student.name || "Anonymous Student"}
                  {student.student_id === currentUserId && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {student.total_points}
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  {student.sessions_completed}
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  {student.quizzes_completed}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
