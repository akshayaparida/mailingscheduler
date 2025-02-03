// src/utils/api.ts
import axios from 'axios';

export const fetchMailings = async () => {
  try {
    console.log('Fetching mailings from API...');
    const response = await axios.get('/api/mailings');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch mailings');
    }
    
    console.log('API response:', response.data);
    return response.data.data; // Return just the mailings array
  } catch (error) {
    console.error('Error details:', {
      error,
      response: axios.isAxiosError(error) ? error.response?.data : null
    });

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error) {
        throw new Error(`Server error: ${error.response.data.error}`);
      } else if (error.response) {
        throw new Error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No response from server');
      }
    }
    throw new Error('Failed to fetch mailings');
  }
};

export const createMailing = async (mailingData: any) => {
  try {
    console.log('Sending mailing data:', {
      templateId: parseInt(mailingData.templateId),
      listId: parseInt(mailingData.listId),
      scheduleTime: mailingData.scheduleTime,
      subject: mailingData.subject,
      body: mailingData.body,
    });

    const response = await axios.post('/api/mailings', {
      templateId: parseInt(mailingData.templateId),
      listId: parseInt(mailingData.listId),
      scheduleTime: mailingData.scheduleTime,
      subject: mailingData.subject,
      body: mailingData.body,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server response error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to create mailing');
    }
    throw error;
  }
};

export const deleteMailing = async (id: number) => {
  const response = await axios.delete(`/api/mailings/${id}`);
  return response.data;
};

export const updateMailing = async (id: number, data: any) => {
  const response = await axios.put(`/api/mailings/${id}`, data);
  return response.data;
};
