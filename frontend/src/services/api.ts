import axios from 'axios';

const API_URL = 'http://localhost:8002/api/v1';

export const api = {
    uploadResumes: async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    createJob: async (title: string, description: string) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        const response = await axios.post(`${API_URL}/jobs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Backend expects Form data now
            },
        });
        return response.data;
    },

    getRankedCandidates: async (jobId: number) => {
        const response = await axios.get(`${API_URL}/jobs/${jobId}/candidates`);
        return response.data;
    },

    getAllCandidates: async () => {
        const response = await axios.get(`${API_URL}/candidates`);
        return response.data;
    },

    deleteAllCandidates: async () => {
        const response = await axios.delete(`${API_URL}/candidates`);
        return response.data;
    },

    deleteCandidate: async (id: number) => {
        const response = await axios.delete(`${API_URL}/candidates/${id}`);
        return response.data;
    }
};
