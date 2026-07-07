import { motion } from 'framer-motion';

const ClientLogos = () => {
  const clients = [
    { name: 'Packaging Co.', color: 'bg-red-500' },
    { name: 'FlexoPrint', color: 'bg-blue-500' },
    { name: 'Global Wraps', color: 'bg-green-500' },
    { name: 'DuraPack', color: 'bg-yellow-500' },
    { name: 'Elite Labels', color: 'bg-purple-500' },
    { name: 'Prime Films', color: 'bg-orange-500' },
  ];

  return (
    <section className="py-16 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold font-heading text-slate-400 mb-8 uppercase tracking-widest">Trusted by Industry Leaders</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
          {clients.map((client, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-xl ${client.color} opacity-50 group-hover:opacity-100 transition-all flex items-center justify-center font-bold text-slate-900 text-xl`}>
                {client.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-500 group-hover:text-white transition-colors">{client.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
