import { useState, useEffect } from 'react';
// Assuming the friendsApi.js is located at the top-level 'api' directory,
// the path needs to go up three levels from 'app/src/hooks/' to the project root, then down to 'api/'.
import * as api from '../../../api/friendsApi'; 

/**
 * Custom hook to manage the state and logic for fetching and managing the user's friends list.
 * It handles loading states, errors, and optimistic UI updates for unfriending.
 * * @returns {object} { friends, isLoading, error, unfriend }
 */
const useFriends = () => {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchFriends = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Call the API function to fetch the data
                const data = await api.getFriendsList(); 
                setFriends(data);
            } catch (err) {
                console.error("Error fetching friends:", err);
                setError("Failed to load your friends list. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchFriends();
    }, []);

    // --- Unfriend Action ---
    /**
     * Attempts to unfriend a user and updates the UI optimistically upon success.
     * @param {number} friendId The ID of the friend to remove.
     */
    const unfriend = async (friendId) => {
        try {
            // 1. Call the API to execute the unfriend action
            await api.unfriendUser(friendId); 
            
            // 2. Optimistic UI Update: Filter the removed friend from the local state
            setFriends(prev => prev.filter(f => f.id !== friendId));
            
            // Optional: Show a success message (e.g., toast notification)
            console.log(`Successfully unfriended user with ID: ${friendId}`);
        } catch (err) {
            console.error("Error unfriending user:", err);
            setError("Could not unfriend user due to a server error.");
            // In case of error, you might want to re-fetch the list to ensure data integrity
            // fetchFriends(); // Re-fetch or rely on user navigating away and back
        }
    };

    return { friends, isLoading, error, unfriend };
};

export default useFriends;
