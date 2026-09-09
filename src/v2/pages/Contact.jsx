import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import NetlifyForm, { SubmitButton } from '../../components/NetlifyForm';
import { PageHeader, Container, Card, focusRing } from '../components/ui';
import {
  PHONE_MOBILE,
  PHONE_MOBILE_DISPLAY,
  PHONE_OFFICE,
  PHONE_OFFICE_DISPLAY,
  EMAIL_PRIMARY,
  EMAIL_SALES,
  WHATSAPP_URL,
  ADDRESS,
} from '../../config/site';
import { trackEvent } from '../../utils/analytics';
import { getProductBySlug } from '../../data/products';
import clsx from 'clsx';

const inputClass =
  'w-full bg-ki-ground border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ki-orange focus:ring-2 focus:ring-ki-orange transition-colors';

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
      const messageField = document.getElementById('v2-message');
      if (messageField && defaultMessage) {
        messageField.value = defaultMessage;
      }
    }
  }, [product, defaultMessage]);

  const handleFormSubmit = () => {
    trackEvent('contact_form_submit', {
      subject: defaultSubject,
      product: productSlug || '',
    });
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', { location: 'contact' });
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { location: 'contact' });
  };

  return (
    <div className="min-h-screen bg-ki-ground pb-20">
      <SEO
        title="Contact"
        description="Contact Klassico Inks for quotes, technical support, and color matching."
        path="/contact"
      />

      <PageHeader
        tone="dark"
        title="Get in Touch"
        description="Have a technical question or need a quote? Our team is ready to assist you."
      />

      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card tone="dark" className="p-8">
              <h2 className="text-2xl font-bold font-heading mb-6 text-white">Send us a message</h2>
              <NetlifyForm name="contact" onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="v2-name" className="block text-sm font-medium text-slate-400 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="v2-name"
                      name="name"
                      required
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="v2-email"
                      className="block text-sm font-medium text-slate-400 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="v2-email"
                      name="email"
                      required
                      className={inputClass}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="v2-subject"
                    className="block text-sm font-medium text-slate-400 mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="v2-subject"
                    name="subject"
                    defaultValue={defaultSubject}
                    className={inputClass}
                  >
                    <option>General Inquiry</option>
                    <option>Request Quote</option>
                    <option>Technical Support</option>
                    <option>Color Matching</option>
                  </select>
                </div>

                {product && <input type="hidden" name="product" value={product.name} />}

                <div>
                  <label
                    htmlFor="v2-message"
                    className="block text-sm font-medium text-slate-400 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="v2-message"
                    name="message"
                    rows="4"
                    required
                    defaultValue={defaultMessage}
                    className={inputClass}
                    placeholder="How can we help you?"
                  />
                </div>

                <SubmitButton className="bg-ki-orange hover:bg-[#e0841a] text-ki-ground font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ki-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ki-ground">
                  Send Message <Send className="h-4 w-4" />
                </SubmitButton>
              </NetlifyForm>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className={clsx(
                  'mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 bg-ki-green hover:bg-[#0f5a38] text-white rounded-lg font-medium transition-colors',
                  focusRing,
                  'focus-visible:ring-offset-ki-ground'
                )}
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold font-heading mb-6 text-white">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-ki-orange/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-ki-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Head Office</h3>
                    <p className="text-slate-300">{ADDRESS.headOffice}</p>
                    <h3 className="font-bold text-white mt-4 mb-1">Factory</h3>
                    <p className="text-slate-300">{ADDRESS.factory}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-ki-green/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-ki-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Phone</h3>
                    <a
                      href={`tel:${PHONE_MOBILE}`}
                      onClick={handlePhoneClick}
                      className={clsx(
                        'text-slate-300 hover:text-white transition block rounded',
                        focusRing,
                        'focus-visible:ring-offset-ki-ground'
                      )}
                    >
                      {PHONE_MOBILE_DISPLAY}
                    </a>
                    <a
                      href={`tel:${PHONE_OFFICE}`}
                      onClick={handlePhoneClick}
                      className={clsx(
                        'text-slate-300 hover:text-white transition block rounded',
                        focusRing,
                        'focus-visible:ring-offset-ki-ground'
                      )}
                    >
                      {PHONE_OFFICE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-ki-orange/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-ki-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Email</h3>
                    <a
                      href={`mailto:${EMAIL_PRIMARY}`}
                      className={clsx(
                        'text-slate-300 hover:text-white transition block rounded',
                        focusRing,
                        'focus-visible:ring-offset-ki-ground'
                      )}
                    >
                      {EMAIL_PRIMARY}
                    </a>
                    <a
                      href={`mailto:${EMAIL_SALES}`}
                      className={clsx(
                        'text-slate-300 hover:text-white transition block rounded',
                        focusRing,
                        'focus-visible:ring-offset-ki-ground'
                      )}
                    >
                      {EMAIL_SALES}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Paper inset */}
            <div
              className="bg-ki-paper text-ki-ground p-6 rounded-xl border border-ki-green/20"
              data-v2-tone="paper"
            >
              <h3 className="font-bold mb-2">Need a color match?</h3>
              <p className="text-slate-600 text-sm mb-4 leading-[1.65]">
                We can match any shade from a wet sample or Pantone guide. Send us your sample
                relevant to your substrate.
              </p>
              <div className="text-ki-orange text-sm font-medium">
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
      </Container>
    </div>
  );
};

export default Contact;
