import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Trash2, Eye, X } from 'lucide-react';

const AdminRequests = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      toast.success(t('admin.saved'));
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('admin.error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;

    try {
      await api.delete(`/requests/${id}`);
      toast.success(t('admin.deleted'));
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error(t('admin.error'));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.requests')}</h1>
        <p className="text-slate-500 mt-1">View and manage client service requests</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-xl border-2 border-primary-200 border-t-primary-600 animate-spin" />
        </div>
      ) : requests.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('admin.name')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('admin.phone')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('admin.email')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('admin.serviceType')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('admin.status')}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('admin.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {request.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {request.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {request.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer focus:ring-2 focus:ring-offset-1 ${getStatusColor(request.status)} border-0 focus:outline-none`}
                      >
                        <option value="pending">{t('admin.pending')}</option>
                        <option value="in_progress">{t('admin.inProgress')}</option>
                        <option value="done">{t('admin.done')}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-2 rounded-xl text-primary-600 hover:bg-primary-50 transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 border-dashed p-16 text-center">
          <p className="text-slate-500">{t('admin.noData')}</p>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">{t('admin.requests')}</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-50/80">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('admin.name')}</label>
                  <p className="text-slate-900 font-medium">{selectedRequest.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('admin.phone')}</label>
                  <p className="text-slate-900">{selectedRequest.phone}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('admin.email')}</label>
                  <p className="text-slate-900">{selectedRequest.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('admin.address')}</label>
                  <p className="text-slate-900">{selectedRequest.address}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('admin.serviceType')}</label>
                  <p className="text-slate-900">{selectedRequest.serviceType}</p>
                </div>
                {selectedRequest.message && (
                  <div className="p-4 rounded-xl bg-slate-50/80">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t('admin.message')}</label>
                    <p className="text-slate-900">{selectedRequest.message}</p>
                  </div>
                )}
                {selectedRequest.image && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('admin.image')}</label>
                    <img
                      src={`http://localhost:5000${selectedRequest.image}`}
                      alt="Request"
                      className="w-full max-w-md h-64 object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('admin.status')}</label>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => {
                      handleStatusChange(selectedRequest._id, e.target.value);
                      setSelectedRequest({ ...selectedRequest, status: e.target.value });
                    }}
                    className={`px-4 py-2.5 rounded-xl font-medium ${getStatusColor(selectedRequest.status)} border-0 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/30`}
                  >
                    <option value="pending">{t('admin.pending')}</option>
                    <option value="in_progress">{t('admin.inProgress')}</option>
                    <option value="done">{t('admin.done')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
