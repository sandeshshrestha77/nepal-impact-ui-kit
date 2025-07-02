import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Users, Calendar, X } from 'lucide-react';
import { supabase, type Program } from '@/lib/supabase';
import { format } from 'date-fns';

const ProgramsSection = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    business_idea: '',
    business_stage: 'idea',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .in('status', ['upcoming', 'ongoing'])
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openApplyModal = (program: Program) => {
    setSelectedProgram(program);
    setShowModal(true);
    setForm({
      full_name: '',
      email: '',
      phone: '',
      age: '',
      location: '',
      business_idea: '',
      business_stage: 'idea',
    });
    setFormSuccess('');
    setFormError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
    setFormSuccess('');
    setFormError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess('');
    setFormError('');
    try {
      const { error } = await supabase.from('participants').insert([
        {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          age: form.age ? parseInt(form.age) : null,
          location: form.location,
          business_idea: form.business_idea,
          business_stage: form.business_stage,
          program_id: selectedProgram?.id,
        }
      ]);
      if (error) throw error;
      setFormSuccess('Application submitted! We will contact you soon.');
      setForm({
        full_name: '',
        email: '',
        phone: '',
        age: '',
        location: '',
        business_idea: '',
        business_stage: 'idea',
      });
    } catch (err: any) {
      setFormError('Error submitting application. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="professional-spacing bg-background">
        <div className="professional-container">
          <div className="text-center">
            <p className="text-muted-foreground">Loading programs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="professional-spacing bg-background">
      <div className="professional-container">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">Our Programs</span>
          <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
            Comprehensive Training & Support Programs
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We offer a range of specialized programs designed to meet entrepreneurs at every stage 
            of their journey, from initial idea development to business scaling and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program, index) => (
            <Card 
              key={program.id} 
              className={`card-shadow border-0 h-full hover-lift animate-fade-in ${
                program.featured ? 'ring-2 ring-primary' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {program.featured && (
                      <Badge className="mb-3 bg-primary text-primary-foreground">
                        🌟 Featured Program
                      </Badge>
                    )}
                    <CardTitle className="font-display text-xl font-bold text-foreground mb-2">
                      {program.title}
                    </CardTitle>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{program.format}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{program.current_participants}/{program.max_participants} participants</span>
                  </div>
                  {program.start_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>Starts: {format(new Date(program.start_date), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {program.description}
                </p>
                
                <div className="pt-4">
                  <Button 
                    variant={program.featured ? "hero" : "outline"} 
                    size="default" 
                    className="w-full hover-lift" 
                    onClick={() => openApplyModal(program)}
                  >
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal for Application Form */}
        {showModal && selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative animate-fade-in">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
              <h3 className="font-display text-2xl font-bold mb-2 text-foreground">Apply for {selectedProgram.title}</h3>
              <p className="text-muted-foreground mb-6">Fill out the form below to register for this program.</p>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input type="number" name="age" value={form.age} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input type="text" name="location" value={form.location} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Business Idea</label>
                  <input type="text" name="business_idea" value={form.business_idea} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Business Stage</label>
                  <select name="business_stage" value={form.business_stage} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                    <option value="idea">Idea</option>
                    <option value="startup">Startup</option>
                    <option value="existing">Existing</option>
                  </select>
                </div>
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                {formSuccess && <div className="text-green-600 text-sm">{formSuccess}</div>}
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={formLoading}>
                  {formLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl lg:text-h2 font-bold text-foreground mb-4">
              Ready to Transform Your Business Idea into Reality?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs who have accelerated their business growth 
              through our comprehensive training programs and ongoing support network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="hover-glow" asChild>
                <Link to="/get-involved">Apply for AWE Program</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-lift" asChild>
                <Link to="/contact">Schedule a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;