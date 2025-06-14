import { Table, Modal, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(''); 
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log('Fetching users...'); // Debugging
                const token = localStorage.getItem('token'); // Retrieve token from localStorage
                console.log('Current user token:', token); // Debugging
                const res = await fetch(`/api/users/getUsers`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token
                    },
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                console.log('API response:', data); // Debugging
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log('Error fetching users:', error.message); // Debugging
            }
        };

        if (currentUser?.isAdmin) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            const res = await fetch(`/api/users/getUsers?startIndex=${startIndex}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token
                },
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            const res = await fetch(`/api/usersdelete/${userIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token
                },
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {users.map((user) => (
                                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()} {/* Ensure correct casing */}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.isAdmin ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>

                    {showMore && (
                        <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no users yet!</p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUsers}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}