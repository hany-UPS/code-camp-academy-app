
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Award, Search, Trophy, User } from "lucide-react";

interface StudentRank {
  student_id: string;
  name: string | null;
  email: string | null;
  total_points: number;
  sessions_completed: number;
  quizzes_completed: number;
  rank: number;
}

interface StudentsRankingTableProps {
  students: StudentRank[];
}

const StudentsRankingTable: React.FC<StudentsRankingTableProps> = ({ students }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof StudentRank; direction: 'ascending' | 'descending' }>({
    key: 'rank',
    direction: 'ascending'
  });
  
  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = student.name?.toLowerCase().includes(searchLower);
    const emailMatch = student.email?.toLowerCase().includes(searchLower);
    return searchQuery === "" || nameMatch || emailMatch;
  });
  
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] === null) return 1;
    if (b[sortConfig.key] === null) return -1;
    
    if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
      return sortConfig.direction === 'ascending' 
        ? (a[sortConfig.key] as string).localeCompare(b[sortConfig.key] as string)
        : (b[sortConfig.key] as string).localeCompare(a[sortConfig.key] as string);
    }
    
    return sortConfig.direction === 'ascending'
      ? (a[sortConfig.key] as number) - (b[sortConfig.key] as number)
      : (b[sortConfig.key] as number) - (a[sortConfig.key] as number);
  });
  
  const requestSort = (key: keyof StudentRank) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-white">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search students by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="max-h-[600px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead 
                  className="w-12 cursor-pointer hover:text-academy-blue"
                  onClick={() => requestSort('rank')}
                >
                  #
                </TableHead>
                <TableHead className="cursor-pointer hover:text-academy-blue" onClick={() => requestSort('name')}>
                  Student
                </TableHead>
                <TableHead className="cursor-pointer hover:text-academy-blue text-right" onClick={() => requestSort('total_points')}>
                  Points
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:text-academy-blue" onClick={() => requestSort('sessions_completed')}>
                  Sessions
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:text-academy-blue" onClick={() => requestSort('quizzes_completed')}>
                  Quizzes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow 
                  key={student.student_id}
                  className={student.rank <= 3 ? "font-medium" : ""}
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {getRankIcon(student.rank)}
                      <span className={student.rank <= 3 ? "sr-only" : ""}>
                        {student.rank}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-1 mr-2">
                        <User className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <div>{student.name || "Unnamed Student"}</div>
                        <div className="text-xs text-gray-500">{student.email || "No email"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {student.total_points}
                  </TableCell>
                  <TableCell className="text-right">
                    {student.sessions_completed}
                  </TableCell>
                  <TableCell className="text-right">
                    {student.quizzes_completed}
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No students found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default StudentsRankingTable;
