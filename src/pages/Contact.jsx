import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import NetlifyForm, { SubmitButton } from '../components/NetlifyForm';
import {
  PHONE_MOBILE,
  PHONE_MOBILE_DISPLAY,
  PHONE_OFFICE,
  PHONE_OFFICE_DISPLAY,
  EMAIL_PRIMARY,
  EMAIL_SALES,
  WHATSAPP_URL,
  ADDRESS,
} from '../config/site';
import { trackEvent } from '../utils/analytics';
import { getProductBySlug } from '../data/products';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const productSlug = searchParams.get('product');
  const doc = searchParams.get('doc');
  const product = productSlug ? getProductBySlug(productSlug) : null;

  const defaultSubject = intent === 'quote' ? 'Request Quote' : 'General Inquiry';
  const defaultMessage = product
    ? doc === 'sds'
      ? `I would like to request the SDS for ${product.name}.`
      : `I would like to request a quote for ${product.name}.`
    : '';

  useEffect(() => {
    if (product) {
      const messageField = document.getElementById('message');
      if (messageField && defaultMessage) {
        messageField.value = defaultMessage;
      }
    }
  }, [product, defaultMessage]);

  const handleFormSubmit = () => {
    trackEvent('contact_form_submit', { subject: defaultSubject, product: productSlug || '' });
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', { location: 'contact' });
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { location: 'contact' });
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <SEO
        title="Contact"
        description="Contact Klassico Inks for quotes, technical support, and color matching. Karachi head office and Gadoon Amazai factory."
        path="/contact"
      />

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700"
          >
            <h2 className="text-2xl font-bold font-heading mb-6">Send us a message</h2>
            <NetlifyForm name="contact" onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue={defaultSubject}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  <option>General Inquiry</option>
                  <option>Request Quote</option>
                  <option>Technical Support</option>
                  <option>Color Matching</option>
                </select>
              </div>

              {product && (
                <input type="hidden" name="product" value={product.name} />
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  defaultValue={defaultMessage}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="How can we help you?"
                />
              </div>

              <SubmitButton>
                Send Message <Send className="h-4 w-4" />
              </SubmitButton>
            </NetlifyForm>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </motion.div>

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
                    <p className="text-slate-400">{ADDRESS.headOffice}</p>
                    <h3 className="font-bold text-white mt-4 mb-1">Factory</h3>
                    <p className="text-slate-400">{ADDRESS.factory}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-secondary-500/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Phone</h3>
                    <a
                      href={`tel:${PHONE_MOBILE}`}
                      onClick={handlePhoneClick}
                      className="text-slate-400 hover:text-white transition block"
                    >
                      {PHONE_MOBILE_DISPLAY}
                    </a>
                    <a
                      href={`tel:${PHONE_OFFICE}`}
                      onClick={handlePhoneClick}
                      className="text-slate-400 hover:text-white transition block"
                    >
                      {PHONE_OFFICE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-500/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Email</h3>
                    <a href={`mailto:${EMAIL_PRIMARY}`} className="text-slate-400 hover:text-white transition block">
                      {EMAIL_PRIMARY}
                    </a>
                    <a href={`mailto:${EMAIL_SALES}`} className="text-slate-400 hover:text-white transition block">
                      {EMAIL_SALES}
                    </a>
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

            <div className="rounded-xl overflow-hidden border border-slate-700">
              <iframe
                title="Klassico Inks location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14571.592038259294!2d66.95646778715818!3d24.886564800000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb31511c69a5e75%3A0x16e30541af19aa50!2sKlassico%20Inks%20(Pvt.)%20Ltd!5e1!3m2!1sen!2sus!4v1770998350096!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
