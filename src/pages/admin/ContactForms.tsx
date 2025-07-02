import React, { useEffect, useState } from 'react';
import { getAdminClient, type ContactSubmission } from '@/lib/supabase';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const defaultForm = { name: '', email: '', subject: '', message: '', status: 'new', admin_notes: '' };

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'archived', label: 'Archived' },
];

const ContactForms: React.FC = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContactSubmission | null>(null);
  const [deleting, setDeleting] = useState<ContactSubmission | null>(null);
  const form = useForm({ defaultValues: defaultForm });

  const fetchData = async () => {
    setLoading(true);
    const supabase = getAdminClient();
    const { data } = await supabase.from('contact_submissions').select('*');
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    form.reset(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (c: ContactSubmission) => {
    setEditing(c);
    form.reset({ ...c });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const supabase = getAdminClient();
    await supabase.from('contact_submissions').delete().eq('id', deleting.id);
    setDeleting(null);
    fetchData();
  };

  const onSubmit = async (values: any) => {
    const supabase = getAdminClient();
    if (editing) {
      const { error } = await supabase.from('contact_submissions').update(values).eq('id', editing.id);
      if (error) {
        alert('Failed to update contact: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('contact_submissions').insert([values]);
      if (error) {
        alert('Failed to add contact: ' + error.message);
        return;
      }
    }
    setModalOpen(false);
    fetchData();
  };

  return (
    <div className="relative card-premium p-0 min-h-[70vh] animate-fade-in">
      <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-t-2xl">
        <h2 className="text-2xl font-bold text-gray-800">Contact Submissions</h2>
        <button
          className="btn-professional flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-button hover:bg-primary/90 transition"
          onClick={openAdd}
        >
          <FiPlus className="text-lg" /> Add Contact
        </button>
      </div>
      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading...</div>
      ) : contacts.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No contact submissions found.</div>
      ) : (
        <div className="overflow-x-auto px-8 pb-8">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
              <tr className="text-left text-gray-500">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr
                  key={c.id}
                  className={`transition-smooth hover:bg-primary/5 ${i % 2 === 1 ? 'bg-muted/60' : 'bg-white/80'}`}
                >
                  <td className="py-3 px-4 font-medium text-gray-800 rounded-l-xl">{c.name}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{c.subject}</td>
                  <td className="py-3 px-4">{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</td>
                  <td className="py-3 px-4 rounded-r-xl">
                    <div className="flex gap-2">
                      <button
                        className="btn-professional p-2 rounded-full hover:bg-primary/10 text-primary transition"
                        title="Edit"
                        onClick={() => openEdit(c)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-professional p-2 rounded-full hover:bg-destructive/10 text-destructive transition"
                        title="Delete"
                        onClick={() => setDeleting(c)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium p-8 w-full max-w-md relative animate-scale-in">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">{editing ? <FiEdit2 /> : <FiPlus />} {editing ? 'Edit' : 'Add'} Contact</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                        <input type="email" className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <input className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <textarea className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} required>
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admin_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Notes</FormLabel>
                      <FormControl>
                        <textarea className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button type="submit" className="btn-professional w-full bg-primary text-white py-2 rounded-lg font-semibold shadow-button hover:bg-primary/90 transition">
                  {editing ? 'Update' : 'Add'} Contact
                </button>
              </form>
            </Form>
          </div>
        </div>
      )}
      {/* Delete confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium p-8 w-full max-w-sm relative animate-scale-in">
            <h3 className="text-lg font-bold mb-4">Delete Contact?</h3>
            <p className="mb-6">Are you sure you want to delete this contact submission?</p>
            <div className="flex gap-4 justify-end">
              <button className="btn-professional px-4 py-2 rounded-lg bg-muted text-gray-700 hover:bg-gray-200" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn-professional px-4 py-2 rounded-lg bg-destructive text-white hover:bg-destructive/90" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForms; 