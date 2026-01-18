"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi, AdminUser } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAnchor } from "react-icons/fi";
import useAdminTab from "../../../_hooks/useAdminTab";

export default function AdminUsersLayout() {
  const router = useRouter();
  const { setTab } = useAdminTab();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
    phone: "",
    address: "",
  });

  const navigateToBoatListings = (userId?: number, action?: string) => {
    const params = new URLSearchParams();
    if (userId) params.set("user", userId.toString());
    if (action) params.set("action", action);

    // Update URL without full page reload
    router.push(`/admin-dashboard?tab=boat-listings${params.toString() ? `&${params.toString()}` : ""}`);
    // Also update Zustand state to switch tab
    setTab("boat-listings");
  };


  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const filters: { search?: string; role?: string } = {};
    if (search) filters.search = search;
    if (roleFilter && roleFilter !== "All Roles") filters.role = roleFilter.toLowerCase();

    const response = await adminApi.getUsers(page, 10, filters);
    if (response.success && response.data) {
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill in required fields");
      return;
    }
    const response = await adminApi.createUser(formData);
    if (response.success) {
      setShowModal(false);
      resetForm();
      fetchUsers();
    } else {
      alert(response.error || "Failed to create user");
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    const updateData = { ...formData };
    if (!updateData.password) delete (updateData as Record<string, unknown>).password;
    const response = await adminApi.updateUser(editingUser.id, updateData);
    if (response.success) {
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } else {
      alert(response.error || "Failed to update user");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const response = await adminApi.deleteUser(userId);
    if (response.success) {
      fetchUsers();
    } else {
      alert(response.error || "Failed to delete user");
    }
  };

  const openEditModal = async (user: AdminUser) => {
    setEditingUser(user);
    // Fetch full user details
    const response = await adminApi.getUser(user.id);
    if (response.success && response.data) {
      setFormData({
        username: response.data.username,
        email: response.data.email,
        password: "",
        role: response.data.role,
        bio: response.data.profile?.bio || "",
        phone: response.data.profile?.phone || "",
        address: response.data.profile?.address || "",
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "user",
      bio: "",
      phone: "",
      address: "",
    });
  };

  return (
    <div className="bg-white rounded-[15.09px] p-[26px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
        <div>
          <p className="text-[#0A0A0A] font-medium text-lg">Users Management</p>
          <p className="text-[#717182] font-normal text-sm">
            Manage all registered users ({users.length} shown)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="bg-[#F3F3F5] flex items-center gap-2 px-3 py-2 rounded-lg flex-1">
          <FiSearch className="text-[#717182]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by username or email..."
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="captain">Captain</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {["User", "Email", "Role", "Boats", "Joined", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-4 text-sm font-semibold text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span className="text-blue-600 text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
                      user.role === "captain" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.boats_count}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <FiEdit2 className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigateToBoatListings(user.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Boats"
                      >
                        <FiAnchor className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => navigateToBoatListings(user.id, "add")}
                        className="p-1 hover:bg-green-50 rounded"
                        title="Add Boat"
                      >
                        <FiPlus className="text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <FiTrash2 className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? "(leave blank to keep current)" : "*"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="captain">Captain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingUser ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
