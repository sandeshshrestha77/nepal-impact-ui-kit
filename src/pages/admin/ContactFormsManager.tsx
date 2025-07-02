import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase, type ContactSubmission } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import { Eye, Edit, Trash2, Search, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const ContactFormsManager = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();
  const { user } = useAdmin();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Status updated successfully"
      });
      
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleAddResponse = async () => {
    if (!selectedContact || !adminNotes.trim()) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          admin_notes: adminNotes,
          responded_at: new Date().toISOString(),
          responded_by: user?.id,
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedContact.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Response added successfully"
      });
      
      setIsResponseDialogOpen(false);
      setAdminNotes('');
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      console.error('Error adding response:', error);
      toast({
        title: "Error",
        description: "Failed to add response",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Contact submission deleted successfully"
      });
      
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact submission",
        variant: "destructive"
      });
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-6">Loading contact submissions...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Forms Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchContacts}>
            Refresh
          </Button>
        </div>
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
                  placeholder="Search contacts..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Responded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.subject || 'No subject'}</TableCell>
                  <TableCell>
                    <Select
                      value={contact.status}
                      onValueChange={(value) => handleStatusUpdate(contact.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusBadge(contact.status)}>
                          {contact.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{format(new Date(contact.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    {contact.responded_at ? format(new Date(contact.responded_at), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedContact(contact);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedContact(contact);
                          setAdminNotes(contact.admin_notes || '');
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
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

      {/* View Contact Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p>{selectedContact.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p>{selectedContact.email}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Subject</Label>
                <p>{selectedContact.subject || 'No subject'}</p>
              </div>
              <div>
                <Label className="font-semibold">Message</Label>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={getStatusBadge(selectedContact.status)}>
                    {selectedContact.status}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Submitted</Label>
                  <p>{format(new Date(selectedContact.created_at), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
              {selectedContact.admin_notes && (
                <div>
                  <Label className="font-semibold">Admin Notes</Label>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedContact.admin_notes}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your inquiry'}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply via Email
                </Button>
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Admin Response</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Contact: {selectedContact.name} ({selectedContact.email})</Label>
                <p className="text-sm text-muted-foreground">Subject: {selectedContact.subject || 'No subject'}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin_notes">Admin Notes/Response</Label>
                <Textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add your response or notes here..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsResponseDialogOpen(false);
                    setAdminNotes('');
                    setSelectedContact(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddResponse}>
                  Add Response & Mark Resolved
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactFormsManager;