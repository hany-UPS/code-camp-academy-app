
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Star } from "lucide-react";

interface StudentRankCardProps {
  rank: number;
  totalPoints: number;
  sessionsCompleted: number;
  quizzesCompleted: number;
}

const StudentRankCard: React.FC<StudentRankCardProps> = ({
  rank,
  totalPoints,
  sessionsCompleted,
  quizzesCompleted
}) => {
  const getRankDetails = () => {
    switch (rank) {
      case 1:
        return {
          icon: <Trophy className="h-10 w-10 text-yellow-500" />,
          title: "Top Student",
          color: "from-yellow-500 to-amber-300",
          textColor: "text-yellow-800"
        };
      case 2:
        return {
          icon: <Trophy className="h-10 w-10 text-gray-400" />,
          title: "Silver Rank",
          color: "from-gray-300 to-gray-200",
          textColor: "text-gray-700"
        };
      case 3:
        return {
          icon: <Trophy className="h-10 w-10 text-amber-700" />,
          title: "Bronze Rank",
          color: "from-amber-600 to-amber-300",
          textColor: "text-amber-900"
        };
      default:
        return {
          icon: <Star className="h-10 w-10 text-academy-blue" />,
          title: `Rank #${rank}`,
          color: "from-purple-400 to-indigo-500",
          textColor: "text-white"
        };
    }
  };

  const { icon, title, color, textColor } = getRankDetails();

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className={`bg-gradient-to-r ${color} p-6 text-center`}>
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
        <p className="text-2xl font-bold mt-2 text-white">{totalPoints} Points</p>
      </div>
      <CardContent className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 rounded-lg bg-purple-50">
            <p className="text-sm text-purple-700">Sessions</p>
            <p className="text-xl font-bold text-purple-900">{sessionsCompleted}</p>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50">
            <p className="text-sm text-indigo-700">Quizzes</p>
            <p className="text-xl font-bold text-indigo-900">{quizzesCompleted}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentRankCard;
