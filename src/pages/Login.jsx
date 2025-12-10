import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';
import { loginSchema, signupSchema } from '../utils/validators';
import { ToastContainer } from '../components/Toast';
import { MESSAGES } from '../utils/constants';

export const Login = () => {
  const navigate = useNavigate();
  const { 
    loginWithGoogle, 
    loginWithGithub, 
    loginWithMicrosoft, 
    loginWithLinkedin,
    loginWithEmail,
    signup,
  } = useAuth();
  
  const { toasts, showToast, removeToast } = useToast();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUserIdModal, setShowUserIdModal] = useState(false);
  const [userId, setUserId] = useState('');

  const schema = isSignup ? signupSchema : loginSchema;
  const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm(schema);

  console.log('🔵 Login component mounted', { isSignup, errors });
  const formValues = watch();
  console.log('🔵 Form values:', formValues);
  console.log('🔵 Validation errors:', errors);
  console.log('🔵 Email length:', formValues.email?.length);
  console.log('🔵 Password length:', formValues.password?.length);

  const handleOAuthLogin = async (provider) => {
    console.log('🔵 OAuth login clicked:', provider);
    setLoading(true);
    let result;
    
    switch (provider) {
      case 'google':
        result = await loginWithGoogle();
        break;
      case 'github':
        result = await loginWithGithub();
        break;
      case 'microsoft':
        result = await loginWithMicrosoft();
        break;
      case 'linkedin':
        result = await loginWithLinkedin();
        break;
      default:
        return;
    }

    setLoading(false);

    if (result.success) {
      showToast(MESSAGES.LOGIN_SUCCESS, 'success');
      navigate('/');
    } else {
      showToast(result.error || MESSAGES.ERROR_AUTH, 'error');
    }
  };

  const onSubmit = async (data) => {
    console.log('🟢 FORM SUBMITTED!', { isSignup, data });
    console.log('🟢 This means validation passed!');
    console.log('🟢 Form data received:', JSON.stringify(data, null, 2));
    setLoading(true);
    
    // TEMPORARY: Skip authentication and go directly to dashboard
    console.log('⚠️ DEMO MODE: Bypassing authentication');
    
    setTimeout(() => {
      setLoading(false);
      showToast('Welcome! (Demo Mode)', 'success');
      navigate('/');
    }, 1000);
    
    return;
    
    // Original authentication code (disabled for demo)
    /*
    let result;
    if (isSignup) {
      console.log('🟢 Calling signup function...');
      result = await signup(data.email, data.password, data.displayName);
      console.log('🟢 Signup result:', result);
    } else {
      console.log('🟢 Calling login function...');
      result = await loginWithEmail(data.email, data.password);
      console.log('🟢 Login result:', result);
    }

    setLoading(false);

    if (result.success) {
      console.log('✅ SUCCESS! Redirecting...');
      showToast(isSignup ? MESSAGES.SIGNUP_SUCCESS : MESSAGES.LOGIN_SUCCESS, 'success');
      navigate('/');
    } else {
      console.log('❌ FAILED:', result.error);
      showToast(result.error || MESSAGES.ERROR_AUTH, 'error');
    }
    */
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            DevChallenge
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Code. Compete. Connect.
          </p>
        </div>

        {/* OAuth Buttons - Temporarily disabled until configured in Supabase */}
        {/* Uncomment after setting up OAuth providers in Supabase Dashboard */}
        {false && (
          <>
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
              >
                🔷 Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthLogin('github')}
                disabled={loading}
              >
                🐙 Continue with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthLogin('microsoft')}
                disabled={loading}
              >
                🪟 Continue with Microsoft
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthLogin('linkedin')}
                disabled={loading}
              >
                💼 Continue with LinkedIn
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>
          </>
        )}

        {/* Email/Password Form */}
        <form 
          onSubmit={handleSubmit(
            onSubmit,
            (errors) => {
              console.log('❌ VALIDATION FAILED!', errors);
              console.log('❌ This is why the form did not submit');
              showToast('Please check the form for errors', 'error');
            }
          )} 
          className="space-y-4"
        >
          {/* Debug: Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                Form Errors:
              </p>
              <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {field}: {error.message}</li>
                ))}
              </ul>
            </div>
          )}
          {isSignup && (
            <Input
              label="Display Name"
              {...register('displayName')}
              error={errors.displayName?.message}
            />
          )}
          
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          {isSignup && (
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        {/* Toggle Sign Up/Sign In */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary font-medium hover:underline"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>

      {/* User ID Modal */}
      <Modal
        isOpen={showUserIdModal}
        onClose={() => setShowUserIdModal(false)}
        title="Your Unique User ID"
      >
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Save this ID to share with friends
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
              {userId}
            </p>
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(userId);
              showToast('User ID copied!', 'success');
            }}
          >
            Copy ID
          </Button>
        </div>
      </Modal>
    </div>
  );
};
