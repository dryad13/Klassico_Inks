import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="bg-slate-950 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white"
          >
            Get in Touch
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Have a technical question or need a quote? Our team is ready to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700"
          >
            <h2 className="text-2xl font-bold font-heading mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                  <input type="text" id="name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input type="email" id="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" placeholder="john@company.com" />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                <select id="subject" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors">
                  <option>General Inquiry</option>
                  <option>Request Quote</option>
                  <option>Technical Support</option>
                  <option>Color Matching</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                <textarea id="message" rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                Send Message <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold font-heading mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-500/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Head Office</h3>
                    <p className="text-slate-400">Jodia Bazar, Karachi, Pakistan</p>
                    <h3 className="font-bold text-white mt-4 mb-1">Factory</h3>
                    <p className="text-slate-400">Gadoon Amazai, KPK, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-secondary-500/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Phone</h3>
                    <p className="text-slate-400">+92 345 209 9683</p>
                    <p className="text-slate-400">(92-21) 32586200-3</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-500/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Email</h3>
                    <p className="text-slate-400">danyalsalam@klassicoinks.com</p>
                    <p className="text-slate-400">sales@mahmoodbrothers.com.pk</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
              <h3 className="font-bold text-white mb-2">Need a color match?</h3>
              <p className="text-slate-400 text-sm mb-4">
                We can match any shade from a wet sample or Pantone guide. Send us your sample relevant to your substrate.
              </p>
              <div className="text-primary-400 text-sm font-medium">
                Mail samples to our Karachi Head Office
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-xl overflow-hidden border border-slate-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14571.592038259294!2d66.95646778715818!3d24.886564800000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb31511c69a5e75%3A0x16e30541af19aa50!2sKlassico%20Inks%20(Pvt.)%20Ltd!5e1!3m2!1sen!2sus!4v1770998350096!5m2!1sen!2sus" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
