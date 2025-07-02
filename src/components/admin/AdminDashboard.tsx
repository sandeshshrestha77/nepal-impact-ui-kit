import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { statsAPI } from '@/lib/api';
import {
  Users,
  BookOpen,
  Star,
  Calendar,
  Mail,
  TrendingUp,
  AlertCircle,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  totalTestimonials: number;
  totalEvents: number;
  upcomingEvents: number;
  unreadMessages: number;
  newsletterSubscribers: number;
  pendingApplications: number;
}

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  data: any;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activitiesResponse] = await Promise.all([
          statsAPI.getDashboard(),
          statsAPI.getActivity(10)
        ]);

        setStats(statsResponse.stats);
        setActivities(activitiesResponse.activities);
      } catch (error: any) {
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/users'
    },
    {
      title: 'Active Programs',
      value: stats?.totalPrograms || 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/programs'
    },
    {
      title: 'Testimonials',
      value: stats?.totalTestimonials || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/admin/testimonials'
    },
    {
      title: 'Total Events',
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/events'
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      href: '/admin/events?status=upcoming'
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages || 0,
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/admin/messages?status=unread'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return Users;
      case 'message_received':
        return Mail;
      case 'event_created':
        return Calendar;
      case 'newsletter_subscription':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with Impact Initiative Nepal.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={stat.href}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild>
              <Link to="/admin/programs/new">Add New Program</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/testimonials/new">Add Testimonial</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/events/new">Create Event</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/messages">View Messages</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Server</span>
                <Badge className="bg-green-100 text-green-800">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">File Uploads</span>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Newsletter Service</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats && stats.unreadMessages > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <h3 className="font-medium text-orange-800">
                  You have {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-orange-700">
                  <Link to="/admin/messages" className="underline hover:no-underline">
                    Review messages →
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;