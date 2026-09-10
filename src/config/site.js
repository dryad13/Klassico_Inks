export const SITE_NAME = 'Klassico Inks';
export const SITE_URL = 'https://klassicoinks.com';
export const SITE_DESCRIPTION =
  'Rotogravure, flexographic, water-based, and offset inks, plus solvents, pigments, resins, and related raw materials for packaging print.';

export const PHONE_MOBILE = '+923268413506';
export const PHONE_MOBILE_DISPLAY = '+92 326 8413506';
export const PHONE_OFFICE = '+922132586200';
export const PHONE_OFFICE_DISPLAY = '(92-21) 32586200-3';

export const EMAIL_PRIMARY = 'danyalsalam@klassicoinks.com';
export const EMAIL_SALES = 'sales@mahmoodbrothers.com.pk';

export const WHATSAPP_NUMBER = '923268413506';
export const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hello Klassico Inks, I would like to ask about your printing inks.'
);
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export const SOCIAL = {
  facebook: 'https://www.facebook.com/klassicoinks',
  linkedin: 'https://www.linkedin.com/company/klassico-inks',
};

export const ADDRESS = {
  headOffice: 'Jodia Bazar, Karachi, Pakistan',
  factory: 'Gadoon Amazai, KPK, Pakistan',
};

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/klassico-logo.png`,
  telephone: PHONE_MOBILE,
  email: EMAIL_PRIMARY,
  address: ADDRESS.headOffice,
  geo: {
    latitude: 24.8865648,
    longitude: 66.9564678,
  },
};
