import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { googleSignIn } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            // Sign in with Google via Firebase
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user?.email || !user?.displayName) {
                throw new Error("Missing required Google user information");
            }

            // Prepare user data for backend
            const userData = {
                name: user.displayName,
                email: user.email,
                googlePhotoUrl: user.photoURL,
            };

            // Dispatch the Google sign-in async thunk
            const response = await dispatch(googleSignIn(userData));
            
            // Check if the sign-in was successful
            if (googleSignIn.fulfilled.match(response)) {
                navigate('/');
            } else {
                throw new Error(response.error.message || 'Google authentication failed');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            // Error is already handled by the async thunk
        }
    };

    return (
        <Button 
            type="button" 
            gradientDuoTone="pinkToOrange" 
            outline 
            onClick={handleGoogleClick}
            className="w-full"
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </Button>
    );
}