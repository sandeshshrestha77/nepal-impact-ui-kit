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
import { supabase, type Participant, type Program } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const ParticipantsManager = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    business_idea: '',
    business_stage: 'idea',
    program_id: '',
    application_status: 'pending',
    graduation_status: 'enrolled',
    notes: ''
  });

  useEffect(() => {
    fetchParticipants();
    fetchPrograms();
  }, []);

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch participants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const participantData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        program_id: formData.program_id || null,
        updated_at: new Date().toISOString()
      };

      if (editingParticipant) {
        const { error } = await supabase
          .from('participants')
          .update(participantData)
          .eq('id', editingParticipant.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Participant updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('participants')
          .insert([participantData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Participant added successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingParticipant(null);
      resetForm();
      fetchParticipants();
    } catch (error) {
      console.error('Error saving participant:', error);
      toast({
        title: "Error",
        description: "Failed to save participant",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setFormData({
      full_name: participant.full_name,
      email: participant.email,
      phone: participant.phone || '',
      age: participant.age?.toString() || '',
      location: participant.location || '',
      business_idea: participant.business_idea || '',
      business_stage: participant.business_stage || 'idea',
      program_id: participant.program_id || '',
      application_status: participant.application_status,
      graduation_status: participant.graduation_status,
      notes: participant.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;

    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Participant deleted successfully"
      });
      
      fetchParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
      toast({
        title: "Error",
        description: "Failed to delete participant",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      age: '',
      location: '',
      business_idea: '',
      business_stage: 'idea',
      program_id: '',
      application_status: 'pending',
      graduation_status: 'enrolled',
      notes: ''
    });
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || participant.application_status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      waitlist: 'bg-blue-100 text-blue-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-6">Loading participants...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Participants Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingParticipant(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Participant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingParticipant ? 'Edit Participant' : 'Add New Participant'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_idea">Business Idea</Label>
                <Textarea
                  id="business_idea"
                  value={formData.business_idea}
                  onChange={(e) => setFormData({ ...formData, business_idea: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_stage">Business Stage</Label>
                  <Select value={formData.business_stage} onValueChange={(value) => setFormData({ ...formData, business_stage: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="existing">Existing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program_id">Program</Label>
                  <Select value={formData.program_id} onValueChange={(value) => setFormData({ ...formData, program_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Program</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="application_status">Application Status</Label>
                  <Select value={formData.application_status} onValueChange={(value) => setFormData({ ...formData, application_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="waitlist">Waitlist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduation_status">Graduation Status</Label>
                  <Select value={formData.graduation_status} onValueChange={(value) => setFormData({ ...formData, graduation_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="dropped_out">Dropped Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingParticipant ? 'Update' : 'Add'} Participant
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  placeholder="Search participants..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="waitlist">Waitlist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({filteredParticipants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Business Stage</TableHead>
                <TableHead>Application Status</TableHead>
                <TableHead>Graduation Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.full_name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.location || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {participant.business_stage || 'Not specified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(participant.application_status)}>
                      {participant.application_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {participant.graduation_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(participant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(participant.id)}
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

export default ParticipantsManager;