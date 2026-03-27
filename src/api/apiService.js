const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('ims_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
};

export const apiService = {
    // Users
    async getUsers() {
        const response = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
        return handleResponse(response);
    },

    async updateUserStatus(userId, status) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },

    async assignSupervisor(studentId, supervisorId) {
        const response = await fetch(`${API_BASE_URL}/users/assign-supervisor`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ studentId, supervisorId }),
        });
        return handleResponse(response);
    },

    // Letters
    async getLetterRequests() {
        const response = await fetch(`${API_BASE_URL}/letters/all`, { headers: getHeaders() });
        return handleResponse(response);
    },

    async getMyLetterRequests() {
        const response = await fetch(`${API_BASE_URL}/letters/my-requests`, { headers: getHeaders() });
        return handleResponse(response);
    },

    async createLetterRequest(requestData) {
        const response = await fetch(`${API_BASE_URL}/letters`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(requestData),
        });
        return handleResponse(response);
    },

    async updateLetterStatus(letterId, status) {
        const response = await fetch(`${API_BASE_URL}/letters/${letterId}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },

    // Opportunities
    async getOpportunities() {
        const response = await fetch(`${API_BASE_URL}/opportunities`, { headers: getHeaders() });
        return handleResponse(response);
    },

    async createOpportunity(data) {
        const response = await fetch(`${API_BASE_URL}/opportunities`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async applyToOpportunity(opportunityId) {
        const response = await fetch(`${API_BASE_URL}/opportunities/apply`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ opportunityId }),
        });
        return handleResponse(response);
    },

    async getAllApplications() {
        const response = await fetch(`${API_BASE_URL}/opportunities/applications`, { headers: getHeaders() });
        return handleResponse(response);
    },

    async updateApplicationStatus(applicationId, status) {
        const response = await fetch(`${API_BASE_URL}/opportunities/applications/${applicationId}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },

    async updateOpportunity(opportunityId, data) {
        const response = await fetch(`${API_BASE_URL}/opportunities/${opportunityId}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async deleteOpportunity(opportunityId) {
        const response = await fetch(`${API_BASE_URL}/opportunities/${opportunityId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Logbooks
    async submitLogbook(data) {
        const response = await fetch(`${API_BASE_URL}/logbooks`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async getMyLogs() {
        const response = await fetch(`${API_BASE_URL}/logbooks/my-logs`, { headers: getHeaders() });
        return handleResponse(response);
    },

    async getInternsLogs() {
        const response = await fetch(`${API_BASE_URL}/logbooks/interns-logs`, { headers: getHeaders() });
        return handleResponse(response);
    },

    async updateLogStatus(logId, status, feedback) {
        const response = await fetch(`${API_BASE_URL}/logbooks/${logId}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status, feedback }),
        });
        return handleResponse(response);
    },

    async updateProfile(profileData) {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(profileData),
        });
        return handleResponse(response);
    },

    // Notifications
    async getNotifications() {
        const response = await fetch(`${API_BASE_URL}/notifications`, { headers: getHeaders() });
        return handleResponse(response);
    }
};

