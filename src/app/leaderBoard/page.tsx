"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type User = {
    id: number;
    name: string;
    avatar?: string;
    points: number;
    rank: number;
    growth?: number;
};

const leaderboardData: User[] = [
    { id: 1, name: "Alice", points: 320, rank: 1, growth: 12, avatar: "/avatars/alice.png" },
    { id: 2, name: "Bob", points: 280, rank: 2, growth: 8, avatar: "/avatars/bob.png" },
    { id: 3, name: "Charlie", points: 250, rank: 3, growth: 5, avatar: "/avatars/charlie.png" },
    { id: 4, name: "David", points: 220, rank: 4, growth: 5 },
    { id: 5, name: "Eva", points: 210, rank: 5, growth: 8 },
    { id: 6, name: "Frank", points: 200, rank: 6, growth: -3 },
];

export default function Leaderboard() {
    const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("weekly");

    const top3 = leaderboardData.slice(0, 3);
    const rest = leaderboardData.slice(3);

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">🏆 Skoo Leaderboard</h1>
                    <p className="text-gray-400">Celebrate the top contributors who power the Skoo community.</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                    <Button
                        variant={period === "weekly" ? "default" : "secondary"}
                        onClick={() => setPeriod("weekly")}
                    >
                        Weekly
                    </Button>
                    <Button
                        variant={period === "monthly" ? "default" : "secondary"}
                        onClick={() => setPeriod("monthly")}
                    >
                        Monthly
                    </Button>
                    <Button
                        variant={period === "alltime" ? "default" : "secondary"}
                        onClick={() => setPeriod("alltime")}
                    >
                        All-Time
                    </Button>
                </div>
            </div>

            {/* Podium */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                {top3.map((user) => (
                    <Card
                        key={user.id}
                        className={cn(
                            "bg-gray-900 border border-gray-800 text-center p-4 relative",
                            user.rank === 1 && "scale-105 border-yellow-500"
                        )}
                    >
                        <CardContent>
                            <Avatar className="w-20 h-20 mx-auto mb-3">
                                {user.avatar ? (
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                ) : (
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                )}
                            </Avatar>
                            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                            <p className="text-yellow-400 font-bold text-xl">{user.points} pts</p>
                            {user.growth !== undefined && (
                                <p
                                    className={cn(
                                        "text-sm",
                                        user.growth >= 0 ? "text-green-400" : "text-red-400"
                                    )}
                                >
                                    {user.growth >= 0 ? `↑ ${user.growth}%` : `↓ ${Math.abs(user.growth)}%`}
                                </p>
                            )}
                            <span
                                className={cn(
                                    "absolute top-2 left-2 text-sm font-bold px-2 py-1 rounded",
                                    user.rank === 1
                                        ? "bg-yellow-500 text-black"
                                        : user.rank === 2
                                            ? "bg-gray-400 text-black"
                                            : "bg-orange-400 text-black"
                                )}
                            >
                #{user.rank}
              </span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Rest of leaderboard */}
            <div className="space-y-3">
                {rest.map((user) => (
                    <Card key={user.id} className="bg-gray-900 border border-gray-800">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 font-bold w-6">#{user.rank}</span>
                                <Avatar>
                                    {user.avatar ? (
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                    ) : (
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    )}
                                </Avatar>
                                <span className="text-white font-medium">{user.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-yellow-400 font-bold">{user.points} pts</span>
                                {user.growth !== undefined && (
                                    <span
                                        className={cn(
                                            "text-sm",
                                            user.growth >= 0 ? "text-green-400" : "text-red-400"
                                        )}
                                    >
                    {user.growth >= 0 ? `↑ ${user.growth}%` : `↓ ${Math.abs(user.growth)}%`}
                  </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
