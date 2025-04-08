
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Star, Crown, Medal } from "lucide-react";

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
          icon: <Crown className="h-12 w-12 text-yellow-500" />,
          title: "Top Student",
          color: "from-yellow-500 to-amber-300",
          textColor: "text-yellow-800",
          badge: "Champion"
        };
      case 2:
        return {
          icon: <Trophy className="h-10 w-10 text-gray-400" />,
          title: "Silver Scholar",
          color: "from-gray-300 to-gray-200",
          textColor: "text-gray-700",
          badge: "Outstanding"
        };
      case 3:
        return {
          icon: <Medal className="h-10 w-10 text-amber-700" />,
          title: "Bronze Achiever",
          color: "from-amber-600 to-amber-300",
          textColor: "text-amber-900",
          badge: "Excellent"
        };
      case 4:
      case 5:
        return {
          icon: <Star className="h-10 w-10 text-blue-500" />,
          title: `Star Rank #${rank}`,
          color: "from-blue-400 to-blue-300",
          textColor: "text-blue-800",
          badge: "Rising Star"
        };
      default:
        return {
          icon: <Award className="h-10 w-10 text-academy-blue" />,
          title: `Rank #${rank}`,
          color: "from-purple-400 to-indigo-500",
          textColor: "text-white",
          badge: rank <= 10 ? "Top 10" : "Learning"
        };
    }
  };

  const { icon, title, color, textColor, badge } = getRankDetails();

  return (
    <Card className="overflow-hidden border-0 shadow-lg transform transition-all hover:scale-105">
      <div className={`bg-gradient-to-r ${color} p-6 text-center relative`}>
        {rank <= 3 && (
          <div className="absolute top-2 right-2 bg-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            {badge}
          </div>
        )}
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
            <p className="text-xs text-purple-600">{sessionsCompleted * 10} points</p>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50">
            <p className="text-sm text-indigo-700">Quizzes</p>
            <p className="text-xl font-bold text-indigo-900">{quizzesCompleted}</p>
            <p className="text-xs text-indigo-600">{totalPoints - (sessionsCompleted * 10)} points</p>
          </div>
        </div>
        {rank <= 10 && (
          <div className="mt-3 text-center">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${rank <= 3 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
              {badge}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentRankCard;
