import React from 'react';
import useFriends from '@/hooks/useFriends';
import { Button } from '@/components/ui/button.jsx';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Loader2, UserX } from 'lucide-react';
const FriendsPage = () => {
    // Fetches data and state from the custom hook
    const { friends, isLoading, error, unfriend } = useFriends();

    const handleUnfriend = (friendId, friendName) => {
        // IMPORTANT: Use custom modal UI instead of window.confirm in production
        if (window.confirm(`Are you sure you want to unfriend ${friendName}?`)) {
            unfriend(friendId);
        }
    };

    const leaderboardOrder = [
        'openlake',
        'github',
        'leetcode',
        'codeforces',
        'codechef',
    ];

    const formatLeaderboardName = (key) => {
        // Simple function to capitalize the first letter
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center">
                Your Friends Leaderboard
            </h1>

            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <p className="text-lg text-muted-foreground">Loading friends data...</p>
                </div>
            )}

            {error && (
                <Card className="bg-red-900/20 border-red-500 text-red-300">
                    <CardHeader>
                        <CardTitle>Error Loading Data</CardTitle>
                        <CardDescription className="text-red-400">
                        Failed to fetch friends list: {error}. Please check your API connection.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            {!isLoading && !error && friends.length === 0 && (
                <Card className="text-center p-6">
                    <CardTitle className="text-xl">No Friends Found</CardTitle>
                    <CardDescription className="mt-2">
                        It looks like your friends list is empty. Time to start connecting!
                    </CardDescription>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6">
                {friends.map((friend) => (
                    <Card key={friend.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">
                                {friend.name}
                            </CardTitle>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUnfriend(friend.id, friend.name)}
                                className="flex items-center space-x-1"
                            >
                                <UserX className="h-4 w-4" />
                                <span>Unfriend</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
                                Leaderboard Rankings
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                                {leaderboardOrder.map((board) => {
                                    const rank = friend.rankings?.[board];
                                    return (
                                        <div key={board} className="flex flex-col">
                                            <span className="text-sm font-medium capitalize text-muted-foreground">
                                                {formatLeaderboardName(board)}:
                                            </span>
                                            <span className="text-lg font-mono font-semibold">
                                                #{rank || 'N/A'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FriendsPage;
