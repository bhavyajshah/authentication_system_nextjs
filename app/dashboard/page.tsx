"use client";

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => signOut()} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Welcome, {session?.user?.email}</h2>
            <p className="text-gray-600">
              You are logged in as a {session?.user?.role || 'user'}.
            </p>
          </div>

          {session?.user?.role === 'admin' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
              <p className="text-gray-600">
                You have access to administrative features.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}