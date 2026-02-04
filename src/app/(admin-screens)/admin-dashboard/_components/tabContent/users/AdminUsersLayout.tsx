"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi, AdminUser } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAnchor, FiCalendar, FiMoreVertical, FiPhone, FiInfo, FiStar } from "react-icons/fi";
import useAdminTab from "../../../_hooks/useAdminTab";
import { useToast } from "../../ToastProvider";
import ConfirmModal from "../../ConfirmModal";
import { TableSkeleton } from "../../Skeleton";

export default function AdminUsersLayout() {
  const router = useRouter();
  const { setTab } = useAdminTab();
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [openMenu, setOpenMenu] = useState<{ id: number; top: number; left: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu !== null && !(event.target as Element).closest('.action-menu-trigger')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  useEffect(() => {
    const handleScroll = () => {
      if (openMenu !== null) setOpenMenu(null);
    }
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openMenu]);

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
  };

  const navigateToBookings = (userId: number, username: string) => {
    const params = new URLSearchParams();
    params.set("user", userId.toString());
    router.push(`/admin-dashboard?tab=bookings&${params.toString()}`);
  };

  const navigateToReviews = (userId: number) => {
    const params = new URLSearchParams();
    params.set("user", userId.toString());
    router.push(`/admin-dashboard?tab=reviews&${params.toString()}`);
  };

  // Confirm delete state
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; userId: number | null; username: string }>({
    isOpen: false,
    userId: null,
    username: ""
  });
  const [deleting, setDeleting] = useState(false);


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
      showError("Please fill in required fields");
      return;
    }
    const response = await adminApi.createUser(formData);
    if (response.success) {
      setShowModal(false);
      resetForm();
      fetchUsers();
      showSuccess("User created successfully");
    } else {
      showError(response.error || "Failed to create user");
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
      showSuccess("User updated successfully");
    } else {
      showError(response.error || "Failed to update user");
    }
  };

  const handleDeleteClick = (user: AdminUser) => {
    setConfirmDelete({ isOpen: true, userId: user.id, username: user.username });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete.userId) return;
    setDeleting(true);
    const response = await adminApi.deleteUser(confirmDelete.userId);
    if (response.success) {
      fetchUsers();
      showSuccess("User deleted successfully");
    } else {
      showError(response.error || "Failed to delete user");
    }
    setDeleting(false);
    setConfirmDelete({ isOpen: false, userId: null, username: "" });
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
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
        <div>
          <p className="text-[#0A0A0A] font-bold text-xl">Users Management</p>
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
          className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <FiPlus size={18} /> Add User
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
        <TableSkeleton rows={5} columns={6} />
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            We couldn&apos;t find any users matching your filters.
          </p>
          {(search || roleFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("");
              }}
              className="text-blue-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {["User", "Email", "Role", "Phone", "Bio", "Activity", "Joined", "Actions"].map((h) => (
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span className="text-blue-600 text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 truncate max-w-[120px]" title={user.username}>{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[180px]" title={user.email}>{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
                      user.role === "captain" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[120px]">
                    {user.phone || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[150px]" title={user.bio || ""}>
                    {user.bio || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.role === 'user' ? (
                      <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-yellow-100">
                        <FiCalendar className="w-3 h-3" /> {user.bookings_count} Bookings
                      </span>
                    ) : user.role === 'captain' ? (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-100">
                        <FiAnchor className="w-3 h-3" /> {user.boats_count} Boats
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 px-4 relative">
                    <button
                      className="p-2 hover:bg-gray-200 rounded-full transition action-menu-trigger text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Close if already open for this user
                        if (openMenu?.id === user.id) {
                          setOpenMenu(null);
                          return;
                        }

                        const rect = e.currentTarget.getBoundingClientRect();
                        setOpenMenu({
                          id: user.id,
                          top: rect.bottom,
                          left: rect.left - 180 + rect.width // Align right edge roughly
                        });
                      }}
                    >
                      <FiMoreVertical />
                    </button>


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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete user "${confirmDelete.username}"? This will also delete all their boats and bookings.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, userId: null, username: "" })}
        isLoading={deleting}
      />

      {/* Fixed Position Menu */}
      {openMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] overflow-hidden action-menu-trigger w-48"
          style={{ top: openMenu.top, left: openMenu.left }}
        >
          {(() => {
            const user = users.find(u => u.id === openMenu.id);
            if (!user) return null;
            return (
              <>
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    openEditModal(user);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiEdit2 size={14} /> Edit User
                </button>

                {user.role === 'user' && (
                  <>
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        navigateToBookings(user.id, user.username);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiCalendar size={14} /> View Bookings
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        navigateToReviews(user.id);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiStar size={14} /> View Reviews
                    </button>
                  </>
                )}

                {user.role === 'captain' && (
                  <>
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        navigateToBoatListings(user.id);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiAnchor size={14} /> View Boats
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        navigateToBoatListings(user.id, "add");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                    >
                      <FiPlus size={14} /> Add Boat
                    </button>
                  </>
                )}

                <hr className="border-gray-100" />
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    handleDeleteClick(user);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 size={14} /> Delete User
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
