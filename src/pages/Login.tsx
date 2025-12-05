import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Zap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await login(data as LoginCredentials);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src="/src/assets/logo-tech.svg" 
              alt="SIMEL ITPLN" 
              className="h-14 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Energy Management System</CardTitle>
          <CardDescription>Masukkan kredensial Anda untuk melanjutkan</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@itpln.ac.id"
                {...register('email')}
                disabled={isLoading}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground mb-3">Akun Demo:</p>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-blue-50 rounded">
                <p className="font-medium text-blue-900">Admin</p>
                <p className="text-blue-700">admin@itpln.ac.id / admin123</p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <p className="font-medium text-green-900">Teknisi</p>
                <p className="text-green-700">teknisi@itpln.ac.id / teknisi123</p>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <p className="font-medium text-purple-900">Manajer</p>
                <p className="text-purple-700">manajer@itpln.ac.id / manajer123</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                <p className="font-medium text-emerald-900">Mahasiswa/Dosen</p>
                <p className="text-emerald-700">nama@itpln.ac.id / mahasiswa123</p>
                <p className="text-xs text-emerald-600 mt-1 italic">
                  * Gunakan email @itpln.ac.id (selain admin/teknisi/manajer)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
