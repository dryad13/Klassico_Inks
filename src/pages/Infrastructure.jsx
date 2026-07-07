import { motion } from 'framer-motion';
import { Microscope, Settings, Award, CheckCircle } from 'lucide-react';

const Infrastructure = () => {
  const labEquipment = [
    { name: 'Gas Chromatography (GC)', desc: 'For precise solvent analysis and purity testing.' },
    { name: 'Tensile Testers', desc: 'To measure bond strength and film elongation properties.' },
    { name: 'Viscometers', desc: 'Ensuring consistent ink viscosity and flow.' },
    { name: 'Spectrophotometers', desc: 'Digital color matching and consistency verification.' },
  ];

  const machinery = [
    { name: 'Bead Mills', desc: 'Advanced milling technology for ultra-fine pigment dispersion.' },
    { name: 'High-Speed Mixers', desc: 'Ensuring homogeneous blending of resins and solvents.' },
    { name: 'Automatic Dispensing', desc: 'Computer-controlled dosing for batch accuracy.' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="bg-slate-950 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white"
          >
            Infrastructure & Quality
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Our commitment to quality is backed by world-class manufacturing facilities and a state-of-the-art laboratory.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Lab Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary-500/10 p-3 rounded-lg">
              <Microscope className="h-8 w-8 text-primary-500" />
            </div>
            <h2 className="text-3xl font-bold font-heading text-white">Quality Control Lab</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labEquipment.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-primary-500/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Machinery Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-secondary-500/20 p-3 rounded-lg">
              <Settings className="h-8 w-8 text-secondary-500" />
            </div>
            <h2 className="text-3xl font-bold font-heading text-white">Manufacturing Plant</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {machinery.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-slate-800/30 p-8 rounded-2xl border border-dotted border-slate-700 text-center"
              >
                <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Settings className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section>
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-8 w-8 text-yellow-500" />
                <h2 className="text-2xl font-bold font-heading text-white">Certifications & Standards</h2>
              </div>
              <p className="text-slate-400 max-w-xl">
                We adhere to strict international standards for safety, quality management, and environmental responsibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {['ISO 9001:2015', 'OHSAS 18001', 'Halal Certified'].map((cert) => (
                <div key={cert} className="flex items-center gap-2 bg-slate-950 px-6 py-3 rounded-lg border border-slate-800 shadow-xl">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-white tracking-wide">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Infrastructure;
