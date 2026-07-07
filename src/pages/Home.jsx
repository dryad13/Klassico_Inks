import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Droplet, Layers, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientLogos from '../components/ClientLogos';

const Hero = () => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0" />
      
      {/* Abstract Shapes/Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl z-0"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-900/30 rounded-full blur-3xl z-0"
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block py-1 px-3 rounded-full bg-secondary-900 border border-secondary-500 text-primary-500 text-sm font-medium mb-6"
        >
          Industrial Ink Solutions
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight leading-tight uppercase"
        >
          DRIVING <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-white to-primary-600">INNOVATION</span><br/>
          IN MANUFACTURING
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Klassico Inks delivers high-performance Rotogravure and Flexographic inks tailored for the modern packaging industry. 
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/products" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2">
            View Products <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700">
            Contact Sales
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
  >
    <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary-500" />
    </div>
    <h3 className="text-xl font-bold font-heading mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Choose Klassico?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We combine advanced technology with deep industry expertise to deliver inks that perform perfectly on your substrates.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Droplet}
              title="Expert Color Matching"
              desc="Our lab can match any shade from a wet sample, printed substrate, or Pantone guide with absolute precision."
            />
            <FeatureCard 
              icon={Layers}
              title="Wide Substrate Compatibility"
              desc="From PET and BOPP to Aluminum Foil and Polyethylene, we have specialized series for every material."
            />
            <FeatureCard 
              icon={Zap}
              title="High Performance"
              desc="Inks designed for high speed, scratch resistance, and excellent bonding strength for lamination."
            />
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <ClientLogos />

      {/* CTA Section */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Ready to upgrade your print quality?</h2>
          <p className="text-slate-400 mb-8 text-lg">Join 5,000+ satisfied clients who trust Klassico Inks for their packaging needs.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-lg font-bold transition-all shadow-xl">
            Get a Quote <CheckCircle className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
