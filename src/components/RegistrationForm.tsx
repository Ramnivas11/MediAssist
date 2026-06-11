import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Send, User, Activity, AlertCircle } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (formattedMessage: string) => void;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [name, setName] = useState('Ramnivas');
  const [requestType, setRequestType] = useState('Patient Support');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !details) return;
    
    const formatted = `[Form Submission]
Type: ${requestType}
Name: ${name}
Details: ${details}

Please process this registration form and triage appropriately.`;
    
    onSubmit(formatted);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-950">
      <div className="max-w-xl mx-auto py-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
               <FileText className="w-5 h-5 text-blue-500" />
             </div>
             <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight font-sans">Support & Registration</h1>
          </div>
          <p className="text-sm text-zinc-400">
            Submit a formal request. Our AI triage system will automatically categorize and prioritize your submission.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-500" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramnivas"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" />
              Request Type
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all outline-none appearance-none"
            >
              <option value="Patient Support">Patient Support / Medical Query</option>
              <option value="Volunteer Registration">Volunteer Registration</option>
              <option value="General Contact">General Contact</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-500" />
              Details / Symptoms
            </label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please describe why you are reaching out or elaborate on your symptoms..."
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Submit for AI Triage
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
