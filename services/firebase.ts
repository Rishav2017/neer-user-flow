import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Store confirmation result for OTP verification
let confirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null;

// Send OTP using Firebase Phone Auth
export const sendOTP = async (phoneNumber: string): Promise<boolean> => {
  // Ensure phone number has country code
  const formattedPhone = phoneNumber.startsWith('+')
    ? phoneNumber
    : `+91${phoneNumber}`;

  try {
    const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
    confirmationResult = confirmation;
    return true;
  } catch (error: any) {
    console.error('Send OTP error:', error);
    throw error;
  }
};

// Verify OTP and get user credential
export const verifyOTP = async (otp: string): Promise<{ idToken: string; phoneNumber: string }> => {
  if (!confirmationResult) {
    throw new Error('No confirmation result. Please request OTP first.');
  }

  try {
    const userCredential = await confirmationResult.confirm(otp);

    if (!userCredential.user) {
      throw new Error('Verification failed');
    }

    // Get the ID token for backend verification
    const idToken = await userCredential.user.getIdToken();
    const phoneNumber = userCredential.user.phoneNumber || '';

    // Clear confirmation result after successful verification
    confirmationResult = null;

    return {
      idToken,
      phoneNumber,
    };
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// Get current user's ID token
export const getIdToken = async (): Promise<string | null> => {
  const user = auth().currentUser;
  if (!user) return null;
  return user.getIdToken();
};

// Sign out
export const signOut = async (): Promise<void> => {
  await auth().signOut();
  confirmationResult = null;
};

// Get current user
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

// Check if user is signed in
export const isSignedIn = (): boolean => {
  return auth().currentUser !== null;
};

// Listen to auth state changes
export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
): (() => void) => {
  return auth().onAuthStateChanged(callback);
};

export default auth;
