const BACKEND = import.meta.env.VITE_BACKEND;

export const fetchOrganizations = async (authTokens) => {
  const response = await fetch(`${BACKEND}/organizations/`, {
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch organizations");
  return response.json();
};

export const createOrganization = async (authTokens, data) => {
  const response = await fetch(`${BACKEND}/organizations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTokens?.access}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create organization");
  return response.json();
};

export const joinOrganization = async (authTokens, joinCode) => {
  const response = await fetch(`${BACKEND}/organizations/join/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTokens?.access}`,
    },
    body: JSON.stringify({ join_code: joinCode }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to join organization");
  }
  return response.json();
};

export const fetchOrgLeaderboard = async (authTokens, orgId, platform) => {
  const response = await fetch(
    `${BACKEND}/organizations/${orgId}/leaderboard/?platform=${platform}`,
    {
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch organization leaderboard");
  return response.json();
};

export const fetchOrganizationDetails = async (authTokens, orgId) => {
  const response = await fetch(`${BACKEND}/organizations/${orgId}/`, {
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch organization details");
  return response.json();
};

export const leaveOrganization = async (authTokens, orgId) => {
  const response = await fetch(`${BACKEND}/organizations/${orgId}/leave/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to leave organization");
  }
  if (response.status === 204) return null;
  return response.json();
};

export const removeMember = async (authTokens, orgId, userId) => {
  const response = await fetch(`${BACKEND}/organizations/${orgId}/remove_member/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTokens?.access}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove member");
  }
  return response.json();
};

export const fetchOrganizationMembers = async (authTokens, orgId) => {
  const response = await fetch(`${BACKEND}/organizations/${orgId}/members/`, {
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch organization members");
  return response.json();
};

export const fetchPublicOrganizations = async (authTokens) => {
  const response = await fetch(`${BACKEND}/organizations/discover/`, {
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch public groups");
  return response.json();
};

export const joinPublicGroup = async (authTokens, orgId) => {
  const response = await fetch(`${BACKEND}/organizations/join/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTokens?.access}`,
    },
    body: JSON.stringify({ organization_id: orgId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to join group");
  }
  return response.json();
};
