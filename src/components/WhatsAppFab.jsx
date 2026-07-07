import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../config/site';
import { trackEvent } from '../utils/analytics';

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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppFab;
