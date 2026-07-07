import { motion } from 'framer-motion';
import { Award, Users, Globe, PenTool, Target, History, Quote } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <SEO
        title="About"
        description="Learn about Klassico Inks — a legacy of excellence in liquid ink manufacturing under Mahmood Brothers, serving Pakistan's packaging industry."
        path="/about"
      />
      <div className="bg-slate-950 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-heading mb-4 text-white uppercase leading-tight"
          >
            MERGING INDUSTRY ZEAL <br/>
            <span className="text-primary-500">WITH PEAK PRODUCTIVITY</span>
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A legacy of excellence in liquid ink manufacturing, driven by innovation and customer trust.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* CEO Message */}
        <div className="mb-24 bg-secondary-900/30 rounded-2xl p-8 md:p-12 border border-secondary-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
            <Quote className="h-48 w-48 text-primary-500" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 bg-slate-700 rounded-full flex-shrink-0 border-4 border-slate-600 flex items-center justify-center">
               <Users className="h-16 w-16 text-slate-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-white mb-4">CEO Message</h2>
              <p className="text-slate-300 italic leading-relaxed mb-6 text-lg">
                "At Klassico Inks, our vision has always been to set new benchmarks in the printing industry. We don't just manufacture inks; we create solutions that empower brands to shine. Our journey from a humble beginning to a market leader is a testament to our unwavering commitment to quality and customer satisfaction."
              </p>
              <div>
                <p className="font-bold text-white">Mr. Danyal Salam</p>
                <p className="text-primary-500 text-sm">Chief Executive Officer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700">
            <div className="bg-primary-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white mb-4">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              To provide world-class printing ink solutions that enhance the value of our customers' products through innovation, consistency, and sustainable practices.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700">
            <div className="bg-secondary-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Globe className="h-6 w-6 text-secondary-500" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white mb-4">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed">
              To be the preferred partner for the packaging industry globally, recognized for our technical expertise and ethical business standards.
            </p>
          </div>
        </div>

        {/* History / Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <History className="h-6 w-6 text-primary-500" />
              <h2 className="text-3xl font-bold font-heading text-white">Our History</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Klassico Inks was established under the umbrella of <strong>Mahmood Brothers</strong>, a name synonymous with reliability in the industrial sector. We specialize in the manufacturing of high-quality liquid printing inks for flexible packaging.
            </p>
            <p className="text-slate-300 leading-relaxed">
              With a commitment to precision, we operate state-of-the-art manufacturing facilities in <strong>Gadoon Amazai</strong> and maintain a strong presence across Pakistan with offices in Karachi, Lahore, and Faisalabad.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our mission is simple: to provide inks that not only meet but exceed international standards, ensuring vibrant packaging that stands out on the shelf.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center">
               <PenTool className="h-20 w-20 text-slate-600/50" />
            </div>
          </motion.div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
            <Users className="h-10 w-10 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading mb-2">Client Focus</h3>
            <p className="text-slate-400">Over 5,000 satisfied clients rely on us for their daily printing needs.</p>
          </div>
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
            <Award className="h-10 w-10 text-magenta-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading mb-2">Quality First</h3>
            <p className="text-slate-400">Rigorous quality control ensures batch-to-batch consistency for every order.</p>
          </div>
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
            <Globe className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading mb-2">Nationwide</h3>
            <p className="text-slate-400">Strategically located offices and logistics to serve printers across Pakistan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
