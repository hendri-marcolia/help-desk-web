"use client";

import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

import type { Ticket } from '@/api/models/Ticket';
import { AuthService } from '@/api';

interface TicketFormProps {
  onSubmit: (data: Ticket) => void;
  onCancel: () => void;
  initialValues?: Ticket;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [facility, setFacility] = useState(initialValues?.facility || '');
  const [category, setCategory] = useState(initialValues?.category || '');

  const [facilities, setFacilities] = useState(['GOLDEN BREEZE', 'SPRINGWELL', 'DANA POINT']);
  const [categories, setCategories] = useState(['STAFF', 'FACILITY', 'RESIDENT']);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const isUpdate = !!initialValues;
  const formTitle = isUpdate ? 'Update Ticket' : 'Create New Ticket';

  React.useEffect(() => {
    if (hasFetched) return;

    const fetchOptions = async () => {
      try {
        AuthService.getSettingByKeyId({ key_id: 'facility_options' })
          .then((response) => {
            if (response) {
              const facilityOptions = response.data["facility"] || [];

              setFacilities(facilityOptions);
            }
          }
        );
        AuthService.getSettingByKeyId({ key_id: 'category_options' })
          .then((response) => {
            if (response) {
              const categoryOptions = response.data["category"] || [];

              setCategories(categoryOptions);
            }
          }
        );
        
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setHasFetched(true);
      }
    };

    fetchOptions();
  }, [hasFetched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    onSubmit({ title, description, facility, category } as Ticket);
    setIsConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6 border-t-4 border-sky-500">
      <h2 className="text-lg font-semibold text-gray-800">{formTitle}</h2>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        title={formTitle}
        message={`Are you sure you want to ${isUpdate ? 'update' : 'create'} this ticket?`}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirmation}
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="facility" className="block text-sm font-medium text-gray-700">Facility</label>
          <select
            id="facility"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            required
          >
            <option value="">Select Facility</option>
            {facilities.map((facilityOption) => (
              <option key={facilityOption} value={facilityOption}>{facilityOption}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition">
            {isUpdate ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
