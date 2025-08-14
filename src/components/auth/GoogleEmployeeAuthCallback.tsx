import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import EmployeeCompleteProfile from './EmployeeCompleteProfile';

export function GoogleEmployeeAuthCallback() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = getCookie('employee-token');
                console.log("Token found:", !!token);

                if (token) {
                    setIsAuthenticated(true);
                    toast.success('Google authentication successful! Please complete your profile.');
                } else {
                    setError('Authentication failed. Please try again.');
                    toast.error('Authentication failed. Please try again.');
                    setTimeout(() => {
                        navigate('/auth/employee');
                    }, 2000);
                }
            } catch (error) {
                console.error('Google employee auth callback error:', error);
                setError('Authentication failed. Please try again.');
                toast.error('Authentication failed. Please try again.');
                setTimeout(() => {
                    navigate('/auth/employee');
                }, 2000);
            } finally {
                setIsLoading(false);
            }
        };

        handleCallback();
    }, [navigate]);


    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-lg text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Completing Google Authentication</h3>
                    <p className="mt-2 text-sm text-gray-600">Please wait while we verify your account...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-lg text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium">Authentication Failed</h3>
                    <p className="mt-2 text-sm text-gray-600">{error}</p>
                    <p className="mt-2 text-xs text-gray-500">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-lg">
                    <div className="flex min-h-screen items-center justify-center bg-background p-4">
                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle className="text-center text-2xl font-bold">
                                    Complete your profile
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Please upload your resume to complete your employee profile setup.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmployeeCompleteProfile />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
