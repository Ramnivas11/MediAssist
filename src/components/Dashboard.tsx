import { motion } from 'motion/react';
import { Users, Activity, PhoneCall, HandHeart } from 'lucide-react';

interface DashboardProps {
  metrics: {
    totalChats: number;
    emergencyCases: number;
    volunteerRequests: number;
    patientSupport: number;
  };
}

export function Dashboard({ metrics }: DashboardProps) {
  const cards = [
    { title: 'Total Interactive Sessions', value: metrics.totalChats, icon: Activity, color: 'text-blue-500' },
    { title: 'High/Emergency Cases', value: metrics.emergencyCases, icon: PhoneCall, color: 'text-red-500' },
    { title: 'Volunteer Registrations', value: metrics.volunteerRequests, icon: HandHeart, color: 'text-emerald-500' },
    { title: 'Patient Support Queries', value: metrics.patientSupport, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-950">
       <div className="max-w-5xl mx-auto py-6">
         <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight font-sans mb-1">Analytics Dashboard</h1>
         <p className="text-sm text-zinc-400 mb-8">Real-time overview of AI triage operations and intent classification.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={card.title} 
                  className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-sm relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide w-2/3">{card.title}</p>
                     <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${card.color}`}>
                       <Icon className="w-4 h-4" />
                     </div>
                  </div>
                  <p className="text-3xl font-semibold text-zinc-100 font-sans tracking-tight relative z-10">
                    {card.value}
                  </p>
                </motion.div>
              );
            })}
         </div>

         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm min-h-[300px] flex items-center justify-center">
            <div className="text-center">
               <Activity className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
               <h3 className="text-zinc-300 font-medium font-sans">Chart Visualization</h3>
               <p className="text-xs text-zinc-500 mt-1">Sufficient data not yet collected in this session to render timeseries.</p>
            </div>
         </div>
       </div>
    </div>
  );
}
