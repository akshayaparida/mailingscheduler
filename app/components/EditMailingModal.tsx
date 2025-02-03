'use client';

import { useEffect, useState } from 'react';

interface Template {
  id: number;
  name: string;
}

interface MailingList {
  id: number;
  name: string;
}

interface EditMailingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditMailingData) => Promise<void>;
  mailing: {
    id: number;
    templateId: number;
    listId: number;
    schedule: string;
  };
  templates: Template[];
  lists: MailingList[];
}

interface EditMailingData {
  templateId: number;
  listId: number;
  scheduleTime: string;
}

export default function EditMailingModal({
  isOpen,
  onClose,
  onSave,
  mailing,
  templates,
  lists,
}: EditMailingModalProps) {
  const [formData, setFormData] = useState<EditMailingData>({
    templateId: mailing.templateId,
    listId: mailing.listId,
    scheduleTime: new Date(mailing.schedule).toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        templateId: mailing.templateId,
        listId: mailing.listId,
        scheduleTime: new Date(mailing.schedule).toISOString().slice(0, 16),
      });
    }
  }, [isOpen, mailing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving mailing:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Mailing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              id="templateId"
              value={formData.templateId}
              onChange={(e) => setFormData(prev => ({ ...prev, templateId: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="listId" className="block text-sm font-medium text-gray-700">
              Mailing List
            </label>
            <select
              id="listId"
              value={formData.listId}
              onChange={(e) => setFormData(prev => ({ ...prev, listId: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {lists.map(list => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              id="scheduleTime"
              value={formData.scheduleTime}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 