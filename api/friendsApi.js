const BASE_URL = "/api/v1/friends"; 

/**
 * MOCK Function 1: Simulates fetching the list of friends along with their leaderboard rankings.
 * In a real application, this would make a GET request to a backend endpoint.
 * @returns {Promise<Array<{id: number, name: string, avatarUrl: string, rankings: object}>>}
 */
export const getFriendsList = async () => {
    // This is placeholder data; replace with actual API call to your backend
    const placeholderData = [
        { 
            id: 1, 
            name: "Alex Johnson", 
            avatarUrl: "https://placehold.co/48x48/6366F1/FFFFFF?text=AJ",
            rankings: { openlake: 1, github: 5, leetcode: 10, codeforces: 22, codechef: 50 },
        },
        { 
            id: 2, 
            name: "Ben Smith", 
            avatarUrl: "https://placehold.co/48x48/F97316/FFFFFF?text=BS",
            rankings: { openlake: 8, github: 12, leetcode: 5, codeforces: 30, codechef: 15 },
        },
        { 
            id: 3, 
            name: "Cathy Lee", 
            avatarUrl: "https://placehold.co/48x48/10B981/FFFFFF?text=CL",
            rankings: { openlake: 3, github: 7, leetcode: 20, codeforces: 11, codechef: 5 },
        },
        // Add more friends here
    ];

    // Simulate network delay
    return new Promise(resolve => {
        setTimeout(() => resolve(placeholderData), 500); 
    });
    
    // In a real app, you would use:
    // const response = await fetch(BASE_URL);
    // if (!response.ok) throw new Error('Network response was not ok');
    // return response.json();
};

/**
 * MOCK Function 2: Simulates handling the unfriend action.
 * In a real application, this would make a DELETE request to a backend endpoint.
 * @param {number} friendId The ID of the friend to be removed.
 * @returns {Promise<boolean>}
 */
export const unfriendUser = async (friendId) => {
    // Simulate network delay and successful deletion
    return new Promise(resolve => {
        setTimeout(() => resolve(true), 300); 
    });
    
    // In a real app, you would use:
    // const response = await fetch(`${BASE_URL}/${friendId}`, { method: 'DELETE' });
    // if (!response.ok) throw new Error('Failed to unfriend');
    // return response.status === 204;
};
