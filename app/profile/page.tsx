'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { User, Mail, LogOut, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Account Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">First Name</p>
                    <p className="text-foreground font-medium">{user.firstName}</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                    <p className="text-foreground font-medium">{user.lastName}</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>

                  {user.phone && (
                    <div className="p-4 border border-border rounded-lg md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <p className="text-foreground font-medium">{user.phone}</p>
                    </div>
                  )}

                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Account Created</p>
                    <p className="text-foreground font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-foreground font-medium">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Debug Info */}
              <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Debug Information
                </h3>
                <pre className="text-xs text-muted-foreground overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
