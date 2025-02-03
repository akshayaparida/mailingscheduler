"use client";

import { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
}

interface MailingList {
  id: number;
  name: string;
  emails: { address: string }[];
}

interface FormData {
  templateId: number;
  listId: number;
  scheduleTime: string;
}

export default function MailingForm() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    templateId: 0,
    listId: 0,
    scheduleTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });

  // Fetch templates
  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data } = await axios.get('/api/templates');
      return data;
    }
  });

  // Fetch mailing lists
  const { data: lists } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data } = await axios.get('/api/lists');
      return data;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Id') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.templateId || !formData.listId) {
      alert('Please select both a template and a mailing list');
      return;
    }

    setIsSubmitting(true);
    try {
      const template = templates?.data?.find((t: Template) => t.id === formData.templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const response = await axios.post('/api/mailings', {
        ...formData,
        subject: template.subject,
        body: template.body,
      });

      if (!response.data) {
        throw new Error('Failed to create mailing');
      }

      await queryClient.invalidateQueries({ queryKey: ['mailings'] });
      
      setFormData({
        templateId: 0,
        listId: 0,
        scheduleTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
      });
      
      alert('Mailing scheduled successfully!');
    } catch (error) {
      console.error('Error creating mailing:', error);
      alert('Failed to create mailing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create New Mailing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="templateId" className="block text-lg font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            id="templateId"
            name="templateId"
            value={formData.templateId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a template</option>
            {templates?.data?.map((template: Template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="listId" className="block text-lg font-medium text-gray-700 mb-1">
            Mailing List
          </label>
          <select
            id="listId"
            name="listId"
            value={formData.listId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a mailing list</option>
            {lists?.data?.map((list: MailingList) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="scheduleTime" className="block text-lg font-medium text-gray-700 mb-1">
            Schedule Time
          </label>
          <input
            type="datetime-local"
            id="scheduleTime"
            name="scheduleTime"
            value={formData.scheduleTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-500 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Schedule Mailing'}
        </button>
      </form>
    </div>
  );
}
