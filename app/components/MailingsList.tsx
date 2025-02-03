'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';
import EditMailingModal from './EditMailingModal';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Mailing {
  id: number;
  templateId: number;
  listId: number;
  schedule: string;
  status: string;
  template: {
    name: string;
  };
  list: {
    id: number;
  };
}

export default function MailingsList() {
  const queryClient = useQueryClient();
  const [editingMailing, setEditingMailing] = useState<Mailing | null>(null);

  const { data: mailingData, isLoading, error } = useQuery({
    queryKey: ['mailings'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/mailings');
        return data;
      } catch (error) {
        console.error('Error fetching mailings:', error);
        throw new Error('Failed to fetch mailings');
      }
    },
  });

  const { data: templateData } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data } = await axios.get('/api/templates');
      return data;
    },
  });

  const { data: listData } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data } = await axios.get('/api/lists');
      return data;
    },
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mailing?')) return;
    try {
      await axios.delete(`/api/mailings?id=${id}`);
      await queryClient.invalidateQueries({ queryKey: ['mailings'] });
    } catch (error) {
      console.error('Error deleting mailing:', error);
      alert('Failed to delete mailing. Please try again.');
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingMailing) return;
    try {
      await axios.put(`/api/mailings?id=${editingMailing.id}`, data);
      await queryClient.invalidateQueries({ queryKey: ['mailings'] });
      setEditingMailing(null);
    } catch (error) {
      console.error('Error updating mailing:', error);
      alert('Failed to update mailing. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-600">Loading mailings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error loading mailings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Scheduled Mailings</h2>
      <div className="grid gap-4">
        {mailingData?.data.map((mailing: Mailing) => (
          <div key={mailing.id} className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{mailing.template.name}</h3>
                  {mailing.status === 'sent' ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Sent
                    </span>
                  ) : mailing.status === 'failed' ? (
                    <span className="flex items-center text-red-600 text-sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Failed
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Scheduled: {format(new Date(mailing.schedule), 'PPpp')}</p>
              </div>
              <div className="space-x-2">
                {mailing.status === 'pending' && (
                  <button
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    onClick={() => setEditingMailing(mailing)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(mailing.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingMailing && templateData?.data && listData?.data && (
        <EditMailingModal
          isOpen={!!editingMailing}
          onClose={() => setEditingMailing(null)}
          onSave={handleEdit}
          mailing={editingMailing}
          templates={templateData.data}
          lists={listData.data}
        />
      )}
    </div>
  );
}
