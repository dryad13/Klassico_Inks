import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, ORGANIZATION } from '../../config/site';

const SEO = ({ title, description, path = '/', type = 'website' }) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Precision in Every Drop`;
  const pageDescription = description || SITE_DESCRIPTION;
  const canonicalUrl = `${SITE_URL}${path}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: ORGANIZATION.name,
        url: ORGANIZATION.url,
        logo: ORGANIZATION.logo,
        email: ORGANIZATION.email,
        telephone: ORGANIZATION.telephone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Karachi',
          addressCountry: 'PK',
          streetAddress: ORGANIZATION.address,
        },
      },
      {
        '@type': 'LocalBusiness',
        name: ORGANIZATION.name,
        url: ORGANIZATION.url,
        telephone: ORGANIZATION.telephone,
        email: ORGANIZATION.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Karachi',
          addressCountry: 'PK',
          streetAddress: ORGANIZATION.address,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: ORGANIZATION.geo.latitude,
          longitude: ORGANIZATION.geo.longitude,
        },
      },
    ],
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
