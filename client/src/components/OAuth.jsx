import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { googleSignIn } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function OAuth() {
    const auth = getAuth(app); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user?.email) {
                throw new Error("Google account is missing an email address.");
            }

            const userData = {
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                googlePhotoUrl: user.photoURL || '',
            };

            const actionResult = await dispatch(googleSignIn(userData));

            if (googleSignIn.fulfilled.match(actionResult)) {
                toast.success('Google sign-in successful!');
                navigate('/');
            } else {
                const backendError = actionResult.payload?.message || actionResult.error?.message;
                throw new Error(backendError || 'Google sign-in failed');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);

            let errorMessage = 'Failed to sign in with Google';

            if (typeof error === 'object' && error !== null) {
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = 'Sign-in popup was closed before completing the sign-in.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your connection and try again.';
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = 'Popup was blocked. Please enable popups and try again.';
                        break;
                    default:
                        if (error.message) {
                            errorMessage = error.message;
                        }
                }
            }

            toast.error(errorMessage);
        }
    };

    return (
        <Button 
            type="button" 
            gradientDuoTone="pinkToOrange" 
            outline 
            onClick={handleGoogleClick}
            className="w-full"
            aria-label="Continue with Google"
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </Button>
    );
}

