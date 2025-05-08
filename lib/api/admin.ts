import { API_BASE_URL } from './config';

export interface AdminStats {
  totalStudents: number;
  totalUniversities: number;
  totalApplications: number;
  pendingApplications: number;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  education: string;
  profilePicture?: string;
  applicationsCount: number;
}

export interface University {
  id: number;
  name: string;
  location: string;
  logo?: string;
  programsCount: number;
  studentsCount: number;
}

export interface Program {
  id: number;
  name: string;
  university: {
    id: number;
    name: string;
  };
  degree: string;
  duration: string;
  tuitionFee: number;
  applicationCount: number;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch admin stats: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  getPrograms: async (): Promise<Program[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/programs`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch programs: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  searchStudents: async (query: string): Promise<Student[]> => {
    try {
      const url = `${API_BASE_URL}/api/admin/students?name=${encodeURIComponent(query)}`;
      console.log('Searching students with URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search students error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to search students: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      console.log('Raw response:', text);
      
      try {
        const data = JSON.parse(text);
        console.log('Parsed students response:', data);
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error('Error parsing students response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error searching students:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please check if the backend server is running.');
      }
      throw error;
    }
  },

  searchUniversities: async (query: string): Promise<University[]> => {
    try {
      const url = `${API_BASE_URL}/api/admin/universities?name=${encodeURIComponent(query)}`;
      console.log('Searching universities with URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search universities error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to search universities: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      console.log('Raw response:', text);
      
      try {
        const data = JSON.parse(text);
        console.log('Parsed universities response:', data);
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error('Error parsing universities response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error searching universities:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please check if the backend server is running.');
      }
      throw error;
    }
  },

  searchPrograms: async (query: string, degree?: string): Promise<Program[]> => {
    try {
      let url = `${API_BASE_URL}/api/admin/programs?name=${encodeURIComponent(query)}`;
      if (degree) {
        url += `&degree=${encodeURIComponent(degree)}`;
      }
      console.log('Searching programs with URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search programs error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to search programs: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      console.log('Raw response:', text);
      
      try {
        const data = JSON.parse(text);
        console.log('Parsed programs response:', data);
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error('Error parsing programs response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error searching programs:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please check if the backend server is running.');
      }
      throw error;
    }
  },
};