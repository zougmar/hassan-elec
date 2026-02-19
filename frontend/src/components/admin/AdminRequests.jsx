import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import toast from 'react-hot-toast';
import { Trash2, Eye, X, AlertTriangle } from 'lucide-react';

const AdminRequests = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ open: false, mode: 'single', id: null, count: 0 });
  const [deleting, setDeleting] = useState(false);

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

  const openDeleteModal = (mode, id = null, count = 0) => {
    setDeleteModal({ open: true, mode, id, count });
  };

  const closeDeleteModal = () => {
    if (!deleting) setDeleteModal({ open: false, mode: 'single', id: null, count: 0 });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (deleteModal.mode === 'single' && deleteModal.id) {
        await api.delete(`/requests/${deleteModal.id}`);
        toast.success(t('admin.deleted'));
      } else if (deleteModal.mode === 'bulk' && selectedIds.size > 0) {
        await Promise.all([...selectedIds].map((id) => api.delete(`/requests/${id}`)));
        toast.success(t('admin.deleted'));
        setSelectedIds(new Set());
      }
      closeDeleteModal();
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request(s):', error);
      toast.error(t('admin.error'));
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === requests.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(requests.map((r) => r._id)));
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
        <>
          {selectedIds.size > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">
                {selectedIds.size} {t('admin.selected')}
              </span>
              <button
                type="button"
                onClick={() => openDeleteModal('bulk', null, selectedIds.size)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2 className="w-4 h-4" />
                {t('admin.deleteSelected')}
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {t('admin.cancel')}
              </button>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={requests.length > 0 && selectedIds.size === requests.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        aria-label={t('admin.selectAll')}
                      />
                    </th>
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
                    <td className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(request._id)}
                        onChange={() => toggleSelect(request._id)}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        aria-label={`Select ${request.name}`}
                      />
                    </td>
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
                          onClick={() => openDeleteModal('single', request._id)}
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
        </>
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
                      src={getImageUrl(selectedRequest.image)}
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

      {/* Delete confirmation modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden />
              </div>
              <div className="flex-1">
                <h2 id="delete-modal-title" className="text-lg font-semibold text-slate-900">
                  {deleteModal.mode === 'single' ? t('admin.deleteRequest') : t('admin.deleteSelected')}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {deleteModal.mode === 'single'
                    ? t('admin.deleteConfirmRequest')
                    : t('admin.deleteConfirmRequests', { count: deleteModal.count })}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {t('admin.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {deleting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ...
                      </span>
                    ) : deleteModal.mode === 'single' ? (
                      t('admin.delete')
                    ) : (
                      t('admin.deleteSelected')
                    )}
                  </button>
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
