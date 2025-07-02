import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase, type NewsletterSubscriber } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search, Download, Mail, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<NewsletterSubscriber | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    status: 'active',
    source: 'manual'
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch newsletter subscribers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const subscriberData = {
        ...formData,
        name: formData.name || null,
        updated_at: new Date().toISOString()
      };

      if (editingSubscriber) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update(subscriberData)
          .eq('id', editingSubscriber.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Subscriber updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([subscriberData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Subscriber added successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingSubscriber(null);
      resetForm();
      fetchSubscribers();
    } catch (error) {
      console.error('Error saving subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to save subscriber",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (subscriber: NewsletterSubscriber) => {
    setEditingSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      name: subscriber.name || '',
      status: subscriber.status,
      source: subscriber.source
    });
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'unsubscribed') {
        updateData.unsubscribed_at = new Date().toISOString();
      } else if (newStatus === 'active') {
        updateData.unsubscribed_at = null;
      }

      const { error } = await supabase
        .from('newsletter_subscribers')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Subscriber status updated successfully"
      });
      
      fetchSubscribers();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update subscriber status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Subscriber deleted successfully"
      });
      
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscriber",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Source', 'Subscribed Date', 'Unsubscribed Date'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.status,
        sub.source,
        format(new Date(sub.subscribed_at), 'yyyy-MM-dd'),
        sub.unsubscribed_at ? format(new Date(sub.unsubscribed_at), 'yyyy-MM-dd') : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      status: 'active',
      source: 'manual'
    });
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || subscriber.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      unsubscribed: 'bg-red-100 text-red-800',
      bounced: 'bg-yellow-100 text-yellow-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    bounced: subscribers.filter(s => s.status === 'bounced').length
  };

  if (loading) {
    return <div className="p-6">Loading newsletter subscribers...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Newsletter Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingSubscriber(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSubscriber ? 'Edit Subscriber' : 'Add New Subscriber'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                        <SelectItem value="bounced">Bounced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="import">Import</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSubscriber ? 'Update' : 'Add'} Subscriber
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">U</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unsubscribed}</p>
                <p className="text-sm text-muted-foreground">Unsubscribed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">B</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.bounced}</p>
                <p className="text-sm text-muted-foreground">Bounced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers ({filteredSubscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Unsubscribed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>{subscriber.name || '-'}</TableCell>
                  <TableCell>
                    <Select
                      value={subscriber.status}
                      onValueChange={(value) => handleStatusUpdate(subscriber.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusBadge(subscriber.status)}>
                          {subscriber.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                        <SelectItem value="bounced">Bounced</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscriber.source}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(subscriber.subscribed_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    {subscriber.unsubscribed_at ? format(new Date(subscriber.unsubscribed_at), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(subscriber)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(subscriber.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManager;