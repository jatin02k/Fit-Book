'use client'

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function Login(){
    const router = useRouter();
    //initialise states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const payload = { email, password };

        try {
            const res = fetch('/api/admin/login',{
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload),
            })
            if((await res).ok){
                router.push('/admin/dashboard')
            }else{
                const data = await (await res).json();
                setError(data.error ||'Login Failed due to unknown error.')
            }
            
        } catch (err) {
            console.error('Network Error during login:', err);
            setError('Network error. Could not connect to the server.');
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-sm shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl flex items-center justify-center text-indigo-600">
                        <LogIn className="w-5 h-5 mr-2" /> Admin Login
                    </CardTitle>
                    <CardDescription>Access the FitBook Management Dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Display */}
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@fitbook.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}