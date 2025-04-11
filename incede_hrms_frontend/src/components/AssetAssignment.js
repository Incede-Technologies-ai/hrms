import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash } from 'react-icons/fa';
import CustomCalendar from './CustomCalendar';
import './AssetAssignment.css';

function AssetAssignment() {
    const [mode, setMode] = useState('assign');
    const [userType, setUserType] = useState('EMPLOYEE'); // Toggle between EMPLOYEE and INTERN
    const [availableAssets, setAvailableAssets] = useState([]);
    const [users, setUsers] = useState([]); // Generic list for employees or interns
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [assetSearch, setAssetSearch] = useState('');
    const [returnDates, setReturnDates] = useState({});
    const [calendarVisibility, setCalendarVisibility] = useState({});
    const [searchVisible, setSearchVisible] = useState(false);
    const [assetSearchVisible, setAssetSearchVisible] = useState(false);
    const [returnSearch, setReturnSearch] = useState('');

    useEffect(() => {
        fetchAvailableAssets();
        fetchUsers();
    }, [userType]); // Refetch users when userType changes

    const fetchAvailableAssets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/assets/available');
            const filteredAssets = response.data.filter(asset => asset.status === 1); // Filter by status = 1
            const sortedAssets = filteredAssets.sort((a, b) => a.assetId.localeCompare(b.assetId));
            setAvailableAssets(sortedAssets);
        } catch (error) {
            console.error('Error fetching available assets:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const endpoint = userType === 'EMPLOYEE' ? '/api/employees' : '/api/interns';
            const response = await axios.get(`http://localhost:8080${endpoint}`);
            const sortedUsers = response.data.sort((a, b) =>
                String(userType === 'EMPLOYEE' ? a.employeeId : a.internId).localeCompare(
                    String(userType === 'EMPLOYEE' ? b.employeeId : b.internId)
                )
            );
            setUsers(sortedUsers);
        } catch (error) {
            console.error(`Error fetching ${userType.toLowerCase()}s:`, error);
        }
    };

    const fetchActiveAssignments = async (identifier) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/asset-assignments/active/user/${identifier}`);
            setAssignedAssets(response.data); // Set active assignments for the selected user
        } catch (error) {
            console.error('Error fetching latest active assignments:', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        const identifier = userType === 'EMPLOYEE' ? user.employeeId : user.internId; // Use correct ID
        fetchActiveAssignments(identifier);
    };

    const handleSelectAsset = (asset) => {
        setSelectedAssets([...selectedAssets, { ...asset, remarks: '', issueDate: '' }]);
        setAvailableAssets(availableAssets.filter(a => a.assetId !== asset.assetId));
    };

    const handleRemoveAsset = (asset) => {
        setSelectedAssets(selectedAssets.filter(a => a.assetId !== asset.assetId));
        setAvailableAssets([...availableAssets, asset]);
    };

    const handleAssignAssets = async (e) => {
        e.preventDefault();
        if (!selectedUser || selectedAssets.length === 0) {
            Swal.fire('Error', 'Please select a user and at least one asset', 'error');
            return;
        }

        try {
            await Promise.all(selectedAssets.map(asset => {
                const payload = {
                    assetId: asset.assetId,
                    userId: userType === 'EMPLOYEE' ? selectedUser.employeeId : selectedUser.internId,
                    userType,
                    remarks: asset.remarks || `Assigned ${asset.assetType}`,
                    issueDate: asset.issueDate || new Date().toISOString().split('T')[0],
                };
                return axios.post('http://localhost:8080/api/asset-assignments/assign', payload);
            }));

            Swal.fire('Success', 'Assets assigned successfully', 'success');
            setSelectedAssets([]);
            setSelectedUser(null);
            fetchAvailableAssets(); // Refresh available assets
        } catch (error) {
            console.error('Error assigning assets:', error);
            Swal.fire('Error', 'Failed to assign assets', 'error');
        }
    };

    const handleReturnAsset = async (assetId, returnDate, remarks) => {
        try {
            const payload = {
                assetId,
                userId: userType === 'EMPLOYEE' ? selectedUser.employeeId : selectedUser.internId, // Use correct ID
                returnDate: returnDate || new Date().toISOString().split('T')[0],
                remarks: remarks || "Returned",
            };
            await axios.put("http://localhost:8080/api/asset-assignments/return", payload);
            Swal.fire("Success", "Asset returned successfully", "success");
            fetchActiveAssignments(userType === 'EMPLOYEE' ? selectedUser.employeeId : selectedUser.internId); // Refresh active assignments
            fetchAvailableAssets(); // Refresh available assets
        } catch (error) {
            console.error("Error returning asset:", error);
            Swal.fire("Error", "Failed to return asset", "error");
        }
    };

    const handleUpdateAssetDetails = (assetId, field, value) => {
        setSelectedAssets((prevSelectedAssets) =>
            prevSelectedAssets.map((asset) =>
                asset.assetId === assetId ? { ...asset, [field]: value } : asset
            )
        );
    };

    const toggleCalendarVisibility = (assetId) => {
        setCalendarVisibility((prev) => ({
            ...prev,
            [assetId]: !prev[assetId],
        }));
    };

    const filteredUsers = users.filter(user =>
        (user.fullName?.toLowerCase() || '').includes(userSearch.toLowerCase())
    );

    const filteredAssets = availableAssets.filter(asset =>
        (asset.assetType?.toLowerCase() || '').includes(assetSearch.toLowerCase()) ||
        (asset.assetSpecification?.toLowerCase() || '').includes(assetSearch.toLowerCase())
    );

    const filteredAssignedAssets = assignedAssets.filter(asset =>
        (asset.assetType?.toLowerCase() || '').includes(returnSearch.toLowerCase()) ||
        (asset.assetSpecification?.toLowerCase() || '').includes(returnSearch.toLowerCase()) ||
        (asset.assetId?.toLowerCase() || '').includes(returnSearch.toLowerCase())
    );

    return (
        <div className="container">
            <div className="toggle-section">
                <button
                    className={mode === 'assign' ? 'active' : ''}
                    onClick={() => setMode('assign')}
                >
                    Assign Asset
                </button>
                <button
                    className={mode === 'return' ? 'active' : ''}
                    onClick={() => setMode('return')}
                >
                    Return Asset
                </button>
            </div>

            {mode === 'assign' && (
                <div>
                    <div className="tables-container">
                        <div className="table-box">
                            <div className="sticky-header">
                                <h3>{userType === 'EMPLOYEE' ? 'Employees' : 'Interns'}</h3>
                                <div className="user-type-toggle">
                                    <button
                                        className={userType === 'EMPLOYEE' ? 'active' : ''}
                                        onClick={() => setUserType('EMPLOYEE')}
                                    >
                                        Employees
                                    </button>
                                    <button
                                        className={userType === 'INTERN' ? 'active' : ''}
                                        onClick={() => setUserType('INTERN')}
                                    >
                                        Interns
                                    </button>
                                </div>
                                <div className="search-icon-table-container">
                                    <i
                                        className="fas fa-search search-icon-table"
                                        onClick={() => setSearchVisible(!searchVisible)}
                                    ></i>
                                    <input
                                        type="text"
                                        placeholder={`Search ${userType.toLowerCase()}s...`}
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className={`search-input-table ${searchVisible ? 'active' : ''}`}
                                    />
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="scrollable">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{userType === 'EMPLOYEE' ? user.employeeId : user.internId}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.department}</td>
                                            <td>
                                                <button
                                                    className="icon-button"
                                                    onClick={() => handleSelectUser(user)}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-box">
                            <div className="sticky-header">
                                <h3>Available Assets</h3>
                                <div className="search-icon-table-container">
                                    <i
                                        className="fas fa-search search-icon-table"
                                        onClick={() => setAssetSearchVisible(!assetSearchVisible)}
                                    ></i>
                                    <input
                                        type="text"
                                        placeholder="Search assets..."
                                        value={assetSearch}
                                        onChange={(e) => setAssetSearch(e.target.value)}
                                        className={`search-input-table ${assetSearchVisible ? 'active' : ''}`}
                                    />
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Type</th>
                                        <th>Specification</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="scrollable">
                                    {filteredAssets.map((asset) => (
                                        <tr key={asset.assetId}>
                                            <td>{asset.assetId}</td>
                                            <td>{asset.assetType}</td>
                                            <td>{asset.assetSpecification}</td>
                                            <td>
                                                <button
                                                    className="icon-button"
                                                    onClick={() => handleSelectAsset(asset)}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedUser && (
                        <div className="form-container">
                            <h3>
                                Assign Assets to {selectedUser.fullName} (ID:
                                {userType === 'EMPLOYEE'
                                    ? selectedUser.employeeId
                                    : selectedUser.internId}
                                )
                            </h3>
                            <form onSubmit={handleAssignAssets}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Asset ID</th>
                                            <th>Type</th>
                                            <th>Issue Date</th>
                                            <th>Remarks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="scrollable">
                                        {selectedAssets.map((asset) => (
                                            <tr key={asset.assetId}>
                                                <td>{asset.assetId}</td>
                                                <td>{asset.assetType}</td>
                                                <td>
                                                    <CustomCalendar
                                                        value={asset.issueDate}
                                                        onChange={(date) =>
                                                            handleUpdateAssetDetails(
                                                                asset.assetId,
                                                                'issueDate',
                                                                date
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <textarea
                                                        placeholder="Remarks"
                                                        value={asset.remarks}
                                                        onChange={(e) =>
                                                            handleUpdateAssetDetails(
                                                                asset.assetId,
                                                                'remarks',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="textarea-large"
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="icon-button remove"
                                                        onClick={() => handleRemoveAsset(asset)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button type="submit" className="submit-button">
                                    Assign Asset(s)
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {mode === 'return' && (
                <div>
                    <div className="table-box">
                        <div className="sticky-header">
                            <h3>{userType === 'EMPLOYEE' ? 'Employees' : 'Interns'}</h3>
                            <div className="user-type-toggle">
                                <button
                                    className={userType === 'EMPLOYEE' ? 'active' : ''}
                                    onClick={() => setUserType('EMPLOYEE')}
                                >
                                    Employees
                                </button>
                                <button
                                    className={userType === 'INTERN' ? 'active' : ''}
                                    onClick={() => setUserType('INTERN')}
                                >
                                    Interns
                                </button>
                            </div>
                            <div className="search-icon-table-container">
                                <i
                                    className="fas fa-search search-icon-table"
                                    onClick={() => setSearchVisible(!searchVisible)}
                                ></i>
                                <input
                                    type="text"
                                    placeholder={`Search ${userType.toLowerCase()}s...`}
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className={`search-input-table ${searchVisible ? 'active' : ''}`}
                                />
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="scrollable">
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{userType === 'EMPLOYEE' ? user.employeeId : user.internId}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.department}</td>
                                        <td>
                                            <button className="icon-button" onClick={() => handleSelectUser(user)}>
                                                <FaPlus />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {selectedUser && (
                        <div className="form-container">
                            <h3>Return Assets for {selectedUser.fullName} (ID: {userType === 'EMPLOYEE' ? selectedUser.employeeId : selectedUser.internId})</h3>
                            <div className="search-icon-table-container">
                                <i
                                    className="fas fa-search search-icon-table"
                                    onClick={() => setAssetSearchVisible(!assetSearchVisible)}
                                ></i>
                                <input
                                    type="text"
                                    placeholder="Search returned assets..."
                                    value={returnSearch}
                                    onChange={(e) => setReturnSearch(e.target.value)}
                                    className={`search-input-table ${assetSearchVisible ? 'active' : ''}`}
                                />
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Asset ID</th>
                                        <th>Return Date</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="scrollable">
                                    {filteredAssignedAssets.map(asset => (
                                        <tr key={asset.assetId}>
                                            <td>{asset.assetId}</td>
                                            <td>
                                                <CustomCalendar
                                                    value={returnDates[asset.assetId]}
                                                    onChange={(date) =>
                                                        setReturnDates({
                                                            ...returnDates,
                                                            [asset.assetId]: date,
                                                        })
                                                    }
                                                    minDate={new Date(asset.issueDate)}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    placeholder="Remarks"
                                                    onChange={(e) => asset.remarks = e.target.value}
                                                    className="textarea-large"
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="icon-button-return"
                                                    onClick={() => handleReturnAsset(asset.assetId, returnDates[asset.assetId], asset.remarks)}
                                                >
                                                    -
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AssetAssignment;