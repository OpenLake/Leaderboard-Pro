import React from 'react';
import useFriends from '../hooks/useFriends'; // Correct path: from components/ up to src/, then down to hooks/
import { Button } from './ui/button.jsx'; // Correct path: ui/ is assumed to be a subdirectory of components/
import { UserX } from 'lucide-react';

/**
 * Renders the main Friends page, displaying the list of friends, 
 * their leaderboard rankings, and controls to unfriend them.
 */
const FriendsPage = () => {
    // 1. Fetch data and state management from the custom hook
    const { friends, isLoading, error, unfriend } = useFriends();
    
    // Mapping of leaderboard keys to display names
    const leaderboardNames = {
        openlake: 'OpenLake',
        github: 'GitHub',
        leetcode: 'LeetCode',
        codeforces: 'Codeforces',
        codechef: 'CodeChef'
    };

    /**
     * Handles the unfriend button click, showing a confirmation prompt 
     * before calling the unfriend action.
     * @param {number} friendId The ID of the friend to remove.
     * @param {string} friendName The name of the friend for the confirmation message.
     */
    const handleUnfriend = (friendId, friendName) => {
        // IMPORTANT: In a production app, use a custom modal UI instead of window.confirm
        if (window.confirm(`Are you sure you want to unfriend ${friendName}?`)) {
            unfriend(friendId);
        }
    };

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen-minus-header p-8">
                <p className="text-xl text-foreground animate-pulse">Loading friends list...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen-minus-header p-8">
                <p className="text-xl text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    // --- Main Content ---
    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-8 text-foreground border-b pb-2 border-border">
                My Friends ({friends.length})
            </h1>
            
            <div className="space-y-4">
                {friends.length === 0 ? (
                    <div className="text-center p-10 bg-card rounded-xl shadow-lg">
                        <p className="text-lg text-muted-foreground">
                            You don't seem to have any friends yet! Start following other users to see them here.
                        </p>
                    </div>
                ) : (
                    friends.map(friend => (
                        <div 
                            key={friend.id} 
                            className="bg-card text-card-foreground p-4 sm:p-6 rounded-xl shadow-md flex flex-col lg:flex-row justify-between items-start lg:items-center transition-all duration-200 hover:shadow-xl hover:scale-[1.01]"
                        >
                            
                            {/* Friend Info and Avatar */}
                            <div className="flex items-center w-full lg:w-1/4 mb-4 lg:mb-0">
                                <img 
                                    src={friend.avatarUrl} 
                                    alt={friend.name} 
                                    className="w-12 h-12 rounded-full mr-4 border-2 border-primary object-cover"
                                    // Fallback for missing images
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/6366F1/FFFFFF?text=${friend.name[0]}` }} 
                                />
                                <h2 className="text-xl font-bold truncate">{friend.name}</h2>
                            </div>

                            {/* Leaderboard Rankings Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm text-muted-foreground w-full lg:w-2/3 mb-4 lg:mb-0">
                                {Object.entries(friend.rankings).map(([boardKey, rank]) => (
                                    <div key={boardKey} className="flex flex-col">
                                        <span className="font-semibold text-primary">{leaderboardNames[boardKey] || boardKey}</span>
                                        <span className="text-lg font-mono text-foreground font-bold">#{rank}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Unfriend Action */}
                            <Button 
                                variant="destructive" 
                                className="w-full lg:w-fit mt-4 lg:mt-0 whitespace-nowrap"
                                onClick={() => handleUnfriend(friend.id, friend.name)}
                            >
                                <UserX className="w-4 h-4 mr-2" />
                                Unfriend
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
