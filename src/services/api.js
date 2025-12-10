// API utility functions for external APIs (LeetCode, CodeChef, etc.)

const API_BASE_URLS = {
  leetcode: 'https://leetcode.com/graphql',
  codechef: 'https://api.codechef.com',
  hackerrank: 'https://www.hackerrank.com/rest',
  codeforces: 'https://codeforces.com/api',
};

// Error handler
const handleApiError = (error, platform) => {
  console.error(`${platform} API error:`, error);
  return {
    success: false,
    error: error.message || 'An error occurred',
  };
};

// Fetch LeetCode user stats
export const fetchLeetCodeStats = async (username) => {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
        }
      }
    `;
    
    const response = await fetch(API_BASE_URLS.leetcode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      data: data.data.matchedUser,
    };
  } catch (error) {
    return handleApiError(error, 'LeetCode');
  }
};

// Fetch CodeChef user stats
export const fetchCodeChefStats = async (username) => {
  try {
    // Note: CodeChef API requires authentication
    // This is a placeholder - implement with proper API key
    const response = await fetch(`${API_BASE_URLS.codechef}/users/${username}`);
    const data = await response.json();
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    return handleApiError(error, 'CodeChef');
  }
};

// Fetch HackerRank user stats
export const fetchHackerRankStats = async (username) => {
  try {
    // HackerRank doesn't have a public API
    // This is a placeholder - might need web scraping or unofficial API
    return {
      success: false,
      error: 'HackerRank API not available',
    };
  } catch (error) {
    return handleApiError(error, 'HackerRank');
  }
};

// Fetch CodeForces user stats
export const fetchCodeForcesStats = async (username) => {
  try {
    const response = await fetch(
      `${API_BASE_URLS.codeforces}/user.info?handles=${username}`
    );
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'User not found');
    }
    
    return {
      success: true,
      data: data.result[0],
    };
  } catch (error) {
    return handleApiError(error, 'CodeForces');
  }
};

// Fetch all platform stats for a user
export const fetchAllPlatformStats = async (codingProfiles) => {
  const stats = {};
  
  if (codingProfiles.leetcode) {
    stats.leetcode = await fetchLeetCodeStats(codingProfiles.leetcode);
  }
  
  if (codingProfiles.codechef) {
    stats.codechef = await fetchCodeChefStats(codingProfiles.codechef);
  }
  
  if (codingProfiles.hackerrank) {
    stats.hackerrank = await fetchHackerRankStats(codingProfiles.hackerrank);
  }
  
  if (codingProfiles.codeforces) {
    stats.codeforces = await fetchCodeForcesStats(codingProfiles.codeforces);
  }
  
  return stats;
};

// Generic API request handler
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
