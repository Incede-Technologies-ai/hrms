import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AssetManagement.css';

function AssetManagement() {
    const [assets, setAssets] = useState([]);
    const [formData, setFormData] = useState({
        assetId: '',
        assetType: '',
        assetSpecification: '',
        assetSerialNo: '',
        remarks: ''
    });
    const [isEdit, setIsEdit] = useState(false); // Track if the form is in edit mode
    const [showModal, setShowModal] = useState(false); // Track modal visibility
    const [statusUpdates, setStatusUpdates] = useState({}); // Track status updates for each asset
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Number of assets per page
    const [searchInput, setSearchInput] = useState(''); // State for search input

    // Calculate the paginated assets
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    // Filter assets based on search input
    const filteredAssets = assets.filter(
        (asset) =>
            asset.assetId.toLowerCase().includes(searchInput.toLowerCase()) ||
            asset.assetSerialNo.toLowerCase().includes(searchInput.toLowerCase()) ||
            asset.assetSpecification.toLowerCase().includes(searchInput.toLowerCase())
    );

    const currentAssets = filteredAssets.slice(indexOfFirstRow, indexOfLastRow);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/assets');
            const sortedAssets = response.data.sort((a, b) => a.assetId.localeCompare(b.assetId)); // Sort by assetId
            setAssets(sortedAssets);

            // Initialize statusUpdates state for controlled components
            const initialStatusUpdates = {};
            sortedAssets.forEach(asset => {
                initialStatusUpdates[asset.assetId] = {
                    status: asset.status,
                    remarks: asset.remarks || '' // Ensure remarks is not undefined
                };
            });
            setStatusUpdates(initialStatusUpdates);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.assetId || !formData.assetType || !formData.assetSpecification || !formData.assetSerialNo) {
            Swal.fire('Error', 'Please fill in all required fields', 'error');
            return;
        }
        try {
            const response = isEdit
                ? await axios.put(`http://localhost:8080/api/assets/${formData.assetId}`, formData)
                : await axios.post('http://localhost:8080/api/assets/save', formData);

            Swal.fire('Success', isEdit ? 'Asset updated successfully' : 'Asset added successfully', 'success');
            fetchAssets(); // Refresh the asset list
            resetForm();
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Error saving asset:', error);
            Swal.fire('Error', 'Failed to save asset', 'error');
        }
    };

    const handleEdit = (asset) => {
        setFormData(asset); // Pre-fill the form with existing asset details
        setIsEdit(true);
        setShowModal(true); // Open the modal
    };

    const resetForm = () => {
        setFormData({
            assetId: '',
            assetType: '',
            assetSpecification: '',
            assetSerialNo: '',
            remarks: ''
        });
        setIsEdit(false);
    };

    const handleStatusChange = (assetId, newStatus) => {
        setStatusUpdates({
            ...statusUpdates,
            [assetId]: { ...statusUpdates[assetId], status: newStatus }
        });
    };

    const handleRemarksChange = (assetId, newRemarks) => {
        setStatusUpdates(prev => ({
            ...prev,
            [assetId]: {
                ...prev[assetId],  // Keep existing values (status)
                remarks: newRemarks // Update remarks only
            }
        }));
    };

    const updateStatus = async (assetId) => {
        const { status, remarks } = statusUpdates[assetId] || {};
        if (!status) {
            Swal.fire('Error', 'Please select a status to update', 'error');
            return;
        }
        try {
            await axios.put(`http://localhost:8080/api/assets/${assetId}/update-status`, {
                status,
                remarks: remarks?.trim() ? remarks : undefined  // Send only if provided
            });
            Swal.fire('Success', 'Asset status updated successfully', 'success');
            fetchAssets(); // Refresh the asset list
        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire('Error', 'Failed to update asset status', 'error');
        }
    };

    const statusMap = {
        1: "Ready to Assign",
        2: "Not Working",
        3: "In Service",
        4: "Assigned"
    };

    return (
        <div className="asset-management">
            <h2>Asset Management</h2>
            <button
                className="btn-add-asset"
                onClick={() => {
                    resetForm(); // Reset the form for adding a new asset
                    setShowModal(true); // Open the modal
                }}
            >
                Add an Asset
            </button>
            <div className="search-container">
            <div className="search-box">
                <i className="fas fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Search by Asset ID, Serial No, or Specification"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="search-input"
                />
            </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-asset-overlay">
                    <div className="modal-asset">
                        <h3>{isEdit ? 'Update Asset' : 'Add an Asset'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="asset-form-group">
                                <label htmlFor="assetId">Asset ID</label>
                                <input
                                    type="text"
                                    id="assetId"
                                    placeholder="Enter Asset ID"
                                    value={formData.assetId}
                                    onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="asset-form-group">
                                <label htmlFor="assetType">Asset Type</label>
                                <input
                                    type="text"
                                    id="assetType"
                                    placeholder="Enter Asset Type"
                                    value={formData.assetType}
                                    onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="asset-form-group">
                                <label htmlFor="assetSpecification">Specification</label>
                                <input
                                    type="text"
                                    id="assetSpecification"
                                    placeholder="Enter Specification"
                                    value={formData.assetSpecification}
                                    onChange={(e) => setFormData({ ...formData, assetSpecification: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="asset-form-group">
                                <label htmlFor="assetSerialNo">Serial No</label>
                                <input
                                    type="text"
                                    id="assetSerialNo"
                                    placeholder="Enter Serial No"
                                    value={formData.assetSerialNo}
                                    onChange={(e) => setFormData({ ...formData, assetSerialNo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="asset-form-group">
                                <label htmlFor="remarks">Remarks</label>
                                <textarea
                                    id="remarks"
                                    placeholder="Enter Remarks"
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {isEdit ? 'Update Asset' : 'Add Asset'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowModal(false)} // Close the modal
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Asset ID</th>
                        <th>Type</th>
                        <th>Specification</th>
                        <th>Serial No</th>
                        <th>Remarks</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAssets.map((asset) => (
                        <tr key={asset.id}>
                            <td>{asset.assetId}</td>
                            <td>{asset.assetType}</td>
                            <td>{asset.assetSpecification}</td>
                            <td>{asset.assetSerialNo}</td>
                            <td>
                                <textarea
                                    value={statusUpdates[asset.assetId]?.remarks || ''}
                                    onChange={(e) => handleRemarksChange(asset.assetId, e.target.value)}
                                    placeholder="Update remarks"
                                />
                            </td>
                            <td>
                                <select
                                    value={statusUpdates[asset.assetId]?.status || asset.status || ''}
                                    onChange={(e) => handleStatusChange(asset.assetId, e.target.value)}
                                >
                                    <option value="" disabled>Select Status</option>
                                    {Object.entries(statusMap).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(asset)}>
                                    Edit
                                </button>
                                <button onClick={() => updateStatus(asset.assetId)}>Update Status</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-btn"
                >
                    <i className="fas fa-chevron-left"></i> Prev
                </button>

                {[...Array(Math.ceil(filteredAssets.length / rowsPerPage))].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredAssets.length / rowsPerPage)}
                    className="page-btn"
                >
                    Next <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
}

export default AssetManagement;
