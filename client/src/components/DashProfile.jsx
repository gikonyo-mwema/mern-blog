import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess, updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import 'react-circular-progressbar/dist/styles.css';

const DeleteAccountModal = ({ showModal, setShowModal, handleDeleteUser }) => (
  <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
    <Modal.Header />
    <Modal.Body>
      <div className='text-center'>
        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
          Are you sure you want to delete your account?
        </h3>
        <div className='flex justify-center gap-4'>
          <Button color='failure' onClick={handleDeleteUser}>
            Yes, I'm sure
          </Button>
          <Button color='gray' onClick={() => setShowModal(false)}>
            No, cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
);

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setImageFileUploadError('Only JPG and PNG files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setImageFileUploadError('File size must be less than 5MB.');
      return;
    }
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadError(null); // Clear any previous error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    // Check if an image file is selected
    if (!imageFile) {
      setUpdateUserError('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('uploadFile', imageFile);

    try {
      dispatch(updateStart());
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          // Calculate and set the upload progress
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImageFileUploadProgress(percentCompleted);
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch(updateFailure(errorData.message));
        setUpdateUserError(errorData.message);
      } else {
        const data = await response.json();
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile picture updated successfully");
        console.log('Uploaded image URL:', data.url);

        // Optionally update the UI to display the uploaded image
        setImageFileUrl(data.url);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') {
      setUsername(value);
    } else if (id === 'email') {
      setEmail(value);
    } else if (id === 'password') {
      setPassword(value);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress > 0 && (
            <CircularProgressbar
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress > 0 && imageFileUploadProgress < 100 && 'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          value={username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          value={email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          value={password}
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
        <div className='text-red-500 flex justify-between mt-5'>
          <span onClick={() => setShowModal(true)} className='cursor-pointer'>
            Delete Account
          </span>
          <span onClick={handleSignout} className='cursor-pointer'>
            Sign Out
          </span>
        </div>
        {updateUserSuccess && (
          <Alert color='success' className='mt-5'>
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )}
        <DeleteAccountModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleDeleteUser={handleDeleteUser}
        />
      </div>
    );
  }

