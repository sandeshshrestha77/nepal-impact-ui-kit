import React, { useEffect, useState } from 'react';
import { getAdminClient, type Testimonial, type Participant } from '@/lib/supabase';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const defaultForm = { name: '', quote: '', is_featured: false, is_published: true, participant_id: '', business_name: '', location: '', achievement: '', program_completed: '', rating: 5, image_url: '' };

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);
  const form = useForm({ defaultValues: defaultForm });

  const fetchData = async () => {
    setLoading(true);
    const supabase = getAdminClient();
    const { data: tData } = await supabase.from('testimonials').select('*');
    const { data: pData } = await supabase.from('participants').select('*');
    setTestimonials(tData || []);
    setParticipants(pData || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    form.reset(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    form.reset({ ...t });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const supabase = getAdminClient();
    await supabase.from('testimonials').delete().eq('id', deleting.id);
    setDeleting(null);
    fetchData();
  };

  const onSubmit = async (values: any) => {
    const supabase = getAdminClient();
    if (editing) {
      const { error } = await supabase.from('testimonials').update(values).eq('id', editing.id);
      if (error) {
        alert('Failed to update testimonial: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('testimonials').insert([values]);
      if (error) {
        alert('Failed to add testimonial: ' + error.message);
        return;
      }
    }
    setModalOpen(false);
    fetchData();
  };

  return (
    <div className="relative card-premium p-0 min-h-[70vh] animate-fade-in">
      <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-t-2xl">
        <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
        <button
          className="btn-professional flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-button hover:bg-primary/90 transition"
          onClick={openAdd}
        >
          <FiPlus className="text-lg" /> Add Testimonial
        </button>
      </div>
      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No testimonials found.</div>
      ) : (
        <div className="overflow-x-auto px-8 pb-8">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
              <tr className="text-left text-gray-500">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Quote</th>
                <th className="py-3 px-4 font-semibold">Featured</th>
                <th className="py-3 px-4 font-semibold">Published</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t, i) => (
                <tr
                  key={t.id}
                  className={`transition-smooth hover:bg-primary/5 ${i % 2 === 1 ? 'bg-muted/60' : 'bg-white/80'}`}
                >
                  <td className="py-3 px-4 font-medium text-gray-800 rounded-l-xl">{t.name}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{t.quote}</td>
                  <td className="py-3 px-4">{t.is_featured ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4">{t.is_published ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4 rounded-r-xl">
                    <div className="flex gap-2">
                      <button
                        className="btn-professional p-2 rounded-full hover:bg-primary/10 text-primary transition"
                        title="Edit"
                        onClick={() => openEdit(t)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-professional p-2 rounded-full hover:bg-destructive/10 text-destructive transition"
                        title="Delete"
                        onClick={() => setDeleting(t)}
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
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">{editing ? <FiEdit2 /> : <FiPlus />} {editing ? 'Edit' : 'Add'} Testimonial</h3>
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
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote</FormLabel>
                      <FormControl>
                        <textarea className="input bg-white/80 border border-border rounded-lg px-3 py-2 w-full focus-professional" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured</FormLabel>
                      <FormControl>
                        <input type="checkbox" {...field} checked={field.value} value={undefined} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published</FormLabel>
                      <FormControl>
                        <input type="checkbox" {...field} checked={field.value} value={undefined} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button type="submit" className="btn-professional w-full bg-primary text-white py-2 rounded-lg font-semibold shadow-button hover:bg-primary/90 transition">
                  {editing ? 'Update' : 'Add'} Testimonial
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
            <h3 className="text-lg font-bold mb-4">Delete Testimonial?</h3>
            <p className="mb-6">Are you sure you want to delete this testimonial?</p>
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

export default Testimonials; 