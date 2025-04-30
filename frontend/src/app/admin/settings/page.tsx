"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { AuthService } from '@/api/services/AuthService';
import { Setting } from '@/api/models/Setting';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaSave } from 'react-icons/fa';


const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [inputData, setInputData] = useState<string>('');

  const fetchSettings = async () => {
    try {
      const settingsData = await AuthService.getAllSettings();
      if (settingsData && settingsData.settings) {
        setSettings(settingsData.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditSetting = (keyId: string) => {
    setEditingKeyId(keyId);
  };

  const handleSaveSetting = async (keyId: string) => {
    try {
      const parsedData = JSON.parse(inputData);
      await AuthService.updateSetting({
        requestBody: {
          key_id: keyId,
          data: parsedData,
        },
      });
      toast.success('Setting updated successfully!');
      setEditingKeyId(null);
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Invalid JSON data.');
    }
  };

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="overflow-x-auto responsive">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Key ID</th>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Updated At</th>
                <th className="px-4 py-2 text-left">Updated By</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => {
                const keyId = setting.key_id;
                const data = setting.data;
                const updatedAt = setting.updated_at;
                const updatedByName = setting.updated_by_name;
                return (
                  <tr key={keyId} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{keyId}</td>
                    <td className="px-4 py-2">
                      {editingKeyId === keyId ? (
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
                          defaultValue={JSON.stringify(data)}
                          onChange={(e) => setInputData(e.target.value)}
                          required
                        />
                      ) : (
                        JSON.stringify(data)
                      )}
                    </td>
                    <td className="px-4 py-2">{updatedAt.toLocaleString()}</td>
                    <td className="px-4 py-2">{updatedByName}</td>
                    <td className="px-4 py-2">
                      {editingKeyId === keyId ? (
                        <button
                          className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition"
                          onClick={() => handleSaveSetting(keyId)}
                        >
                          Save <FaSave className="inline-block sm-1" />
                        </button>
                      ) : (
                        <button
                          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
                          onClick={() => handleEditSetting(keyId)}
                        >
                          Edit <FaEdit className="inline-block sm-1" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminSettingsPage;
