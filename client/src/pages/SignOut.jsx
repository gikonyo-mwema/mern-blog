import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { Spinner } from 'flowbite-react';

export default function SignOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      try {
        const res = await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          dispatch(signOutSuccess());
          navigate('/sign-in');
        } else {
          console.error('Sign out failed');
          navigate('/');
        }
      } catch (error) {
        console.error('Sign out error:', error); 
        navigate('/');
      }
    };

    signOut();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="xl" />
      <span className="pl-3">Signing out...</span>
    </div>
  );
}