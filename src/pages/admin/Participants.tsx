import React, { useEffect, useState } from 'react';
import { getAdminClient, type Participant, type Program } from '@/lib/supabase';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const defaultForm = { full_name: '', email: '', program_id: '', application_status: '' };

const statusColors: Record<string, string> = {
  pending: 'bg-muted/60 text-gray-500',
  approved: 'bg-secondary/10 text-secondary',
  rejected: 'bg-destructive/10 text-destructive',
  waitlist: 'bg-accent/10 text-accent',
};

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'waitlist', label: 'Waitlist' },
];

const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [deleting, setDeleting] = useState<Participant | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const form = useForm({ defaultValues: defaultForm });

  const fetchData = async () => {
    setLoading(true);
    const supabase = getAdminClient();
    const { data: pData } = await supabase.from('participants').select('*');
    console.log('Fetched participants:', pData);
    const { data: progData } = await supabase.from('programs').select('*');
    setParticipants(pData || []);
    setPrograms(progData || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getProgramTitle = (id?: string) => {
    if (!id) return '-';
    const prog = programs.find(p => p.id === id);
    return prog ? prog.title : '-';
  };

  const openAdd = () => {
    setEditing(null);
    form.reset(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (p: Participant) => {
    setEditing(p);
    form.reset({
      full_name: p.full_name,
      email: p.email,
      program_id: p.program_id,
      application_status: p.application_status,
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const supabase = getAdminClient();
    await supabase.from('participants').delete().eq('id', deleting.id);
    setDeleting(null);
    fetchData();
  };

  const onSubmit = async (values: any) => {
    const supabase = getAdminClient();
    if (editing) {
      const { error } = await supabase.from('participants').update(values).eq('id', editing.id);
      if (error) {
        alert('Failed to update participant: ' + error.message);
        console.error(error);
        return;
      }
    } else {
      const { error } = await supabase.from('participants').insert([values]);
      if (error) {
        alert('Failed to add participant: ' + error.message);
        console.error(error);
        return;
      }
    }
    setModalOpen(false);
    fetchData();
  };

  // Filtered participants for table
  const filteredParticipants = statusFilter
    ? participants.filter((p) => p.application_status === statusFilter)
    : participants;

  return (
    <div className="relative card-premium p-0 min-h-[70vh] animate-fade-in">
      <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-t-2xl">
        <h2 className="text-2xl font-bold text-gray-800">Participants</h2>
        <div className="flex items-center gap-4">
          <select
            className="input bg-white/80 border border-border rounded-lg px-3 py-2 focus-professional text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            className="btn-professional flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-button hover:bg-primary/90 transition"
            onClick={openAdd}
          >
            <FiPlus className="text-lg" /> Add Participant
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading...</div>
      ) : filteredParticipants.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No participants found.</div>
      ) : (
        <div className="overflow-x-auto px-8 pb-8">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
              <tr className="text-left text-gray-500">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Program</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p, i) => {
                console.log('Rendering participant:', JSON.stringify(p, null, 2));
                return (
                  <tr
                    key={p.id}
                    className={`transition-smooth hover:bg-primary/5 ${i % 2 === 1 ? 'bg-muted/60' : 'bg-white/80'}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 rounded-l-xl">{p.full_name}</td>
                    <td className="py-3 px-4">{p.email}</td>
                    <td className="py-3 px-4">{getProgramTitle(p.program_id)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-button ${statusColors[p.application_status] || 'bg-muted text-muted-foreground'}`}>{p.application_status.charAt(0).toUpperCase() + p.application_status.slice(1)}</span>
                    </td>
                    <td className="py-3 px-4 rounded-r-xl">
                      <div className="flex gap-2">
                        <button
                          className="btn-professional p-2 rounded-full hover:bg-primary/10 text-primary transition"
                          title="Edit"
                          onClick={() => openEdit(p)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-professional p-2 rounded-full hover:bg-destructive/10 text-destructive transition"
                          title="Delete"
                          onClick={() => setDeleting(p)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium p-8 w-full max-w-md relative animate-scale-in">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">{editing ? <FiEdit2 /> : <FiPlus />} {editing ? 'Edit' : 'Add'} Participant</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <input className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <input className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" type="email" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="program_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <FormControl>
                        <select className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} required>
                          <option value="">Select program</option>
                          {programs.map((prog) => (
                            <option key={prog.id} value={prog.id}>{prog.title}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="application_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} required>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="waitlist">Waitlist</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" className="btn-professional px-4 py-2 rounded-lg border border-border bg-muted text-gray-700 hover:bg-muted/80 transition" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-professional px-4 py-2 rounded-lg bg-primary text-white shadow-button hover:bg-primary/90 transition flex items-center gap-2">{editing ? <FiEdit2 /> : <FiPlus />} {editing ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-premium p-8 w-full max-w-sm relative animate-scale-in">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive"><FiTrash2 /> Delete Participant</h3>
            <p className="mb-6">Are you sure you want to delete <b>{deleting.full_name}</b>?</p>
            <div className="flex justify-end gap-2">
              <button className="btn-professional px-4 py-2 rounded-lg border border-border bg-muted text-gray-700 hover:bg-muted/80 transition" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn-professional px-4 py-2 rounded-lg bg-destructive text-white shadow-button hover:bg-destructive/90 transition flex items-center gap-2" onClick={handleDelete}><FiTrash2 /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants; 