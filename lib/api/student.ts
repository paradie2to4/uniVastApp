import { API_BASE_URL } from './config';

export interface Program {
  id: number;
  name: string;
  university: {
    id: number;
    name: string;
    location: string;
  };
  degree: string;
  duration: string;
  tuitionFee: number;
  applicationCount: number;
}

export interface University {
  id: number;
  name: string;
  location: string;
  logo?: string;
  programsCount: number;
  studentsCount: number;
}

export const studentApi = {
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

  getUniversities: async (): Promise<University[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/universities`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch universities: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  },

  getProgramsByUniversity: async (universityId: number): Promise<Program[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/universities/${universityId}/programs`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch university programs: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching university programs:', error);
      throw error;
    }
  },

  searchPrograms: async (query: string): Promise<Program[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/programs/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to search programs: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error searching programs:', error);
      throw error;
    }
  },

  searchUniversities: async (query: string): Promise<University[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/universities/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to search universities: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error searching universities:', error);
      throw error;
    }
  },
}; 