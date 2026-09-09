import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../../config/site';
import { trackEvent } from '../../utils/analytics';
import { focusRing } from './ui';

const WhatsAppFab = () => {
  const handleClick = () => {
    trackEvent('whatsapp_click', { location: 'fab' });
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-ki-green hover:bg-[#0f5a38] text-white rounded-full shadow-lg shadow-ki-green/30 transition-all hover:scale-105 ${focusRing} focus-visible:ring-offset-ki-ground`}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppFab;
