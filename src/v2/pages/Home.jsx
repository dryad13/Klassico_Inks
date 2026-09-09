import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import SEO from '../components/SEO';
import Hero from '../components/hero/HeroSection';
import { Section, Container, Button, focusRing } from '../components/ui';
import { getProductImage } from '../../assets/products';
import ProductImage from '../components/ProductImage';
import { WHATSAPP_URL } from '../../config/site';
import { trackEvent } from '../../utils/analytics';

const rawMaterials = [
  {
    id: 'pigments',
    name: 'Pigments',
    imageSlug: 'pigments',
    to: '/products/pigments',
    blurb:
      'Vivid and custom colour for ink manufacture — a diverse pigment range for the shade your job needs.',
  },
  {
    id: 'resins',
    name: 'Resins',
    imageSlug: 'resins',
    to: '/products/resins',
    blurb:
      'Binder systems that strengthen durability, adhesion, and flexibility for long-lasting print.',
  },
  {
    id: 'solvents',
    name: 'Solvents',
    imageSlug: 'solvents-blends',
    to: '/products/solvents-blends',
    blurb:
      'Solvents and blends that keep ink flowing consistently across gravure, flexo, and related processes.',
  },
  {
    id: 'additives',
    name: 'Additives',
    imageSlug: 'nitrocellulose',
    to: '/products?category=industry-products',
    blurb:
      'Fine-tune drying time, viscosity, and adhesion with materials built for press performance.',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Exploration',
    body: 'We dig into ingredients and formulations first — matching chemistry to your substrate, structure, and end market before a shade is locked.',
  },
  {
    step: '02',
    title: 'Development',
    body: 'The lab fine-tunes the composition for colour strength, adhesion, and press behaviour — against a printed pack, wet sample, or Pantone reference.',
  },
  {
    step: '03',
    title: 'Production',
    body: 'Approved formulations move into manufacture with tight batch control, so what you approved in the lab is what arrives on press.',
  },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      <SEO
        path="/"
        description="Klassico Inks — colour that holds on the pack. Rotogravure, flexographic, water-based, and offset inks for packaging."
      />

      <Hero />

      <Section tone="paper" className="py-20 md:py-28">
        <Container>
          <div className="max-w-2xl mx-auto mb-14 text-center">
            <p className="text-sm font-medium text-ki-green uppercase tracking-[0.14em] mb-3">
              Raw materials
            </p>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-ki-ground tracking-tight leading-[1.05]">
              Pigments, resins, solvents, and additives
            </h2>
            <p className="mt-4 text-slate-600 leading-[1.65] text-lg">
              The building blocks behind every Klassico series — chosen for colour strength and press
              performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {rawMaterials.map((item) => {
              const imageSrc = getProductImage(item.imageSlug);
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={clsx(
                    'group relative flex flex-col overflow-hidden bg-ki-ground text-center',
                    'border border-ki-ground shadow-[6px_6px_0_0_rgba(19,107,67,0.35)]',
                    'transition-transform duration-150 ease-out will-change-transform',
                    'hover:-translate-y-1 hover:border-ki-orange hover:shadow-[6px_6px_0_0_rgba(246,147,30,0.55)]',
                    'focus-visible:ring-offset-ki-paper',
                    focusRing
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ki-ground">
                    {imageSrc && (
                      <ProductImage
                        image={imageSrc}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-200 ease-out will-change-transform group-hover:scale-105"
                      />
                    )}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ki-ground from-15% via-ki-ground/70 to-transparent"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute top-0 right-0 h-10 w-10 bg-ki-orange [clip-path:polygon(100%_0,0_0,100%_100%)]"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative z-[1] -mt-px flex flex-1 flex-col bg-ki-ground px-5 pb-6 pt-1">
                    <span
                      className="mx-auto mb-4 block h-0.5 w-10 origin-center scale-x-100 bg-ki-orange transition-transform duration-150 ease-out group-hover:scale-x-[1.6]"
                      aria-hidden="true"
                    />
                    <h3 className="text-xl font-bold font-heading uppercase tracking-wide text-white mb-3 group-hover:text-ki-orange">
                      {item.name}
                    </h3>
                    <p className="text-slate-300 text-sm leading-[1.65] mb-5 flex-1">{item.blurb}</p>
                    <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ki-orange">
                      Learn More{' '}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Button to="/products" variant="secondary">
              Full catalog <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-20 md:py-24 border-t border-ki-green/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <div className="lg:col-span-6">
              <p className="text-sm font-medium text-ki-green uppercase tracking-[0.14em] mb-3">
                Colour match
              </p>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-ki-ground tracking-tight leading-[1.05] mb-5">
                Matched to your substrate
              </h2>
              <p className="text-slate-600 leading-[1.65] text-lg max-w-xl">
                Send a wet sample, printed pack, or Pantone reference. We match the shade for your
                process — flexible film, PET, corrugated, or offset.
              </p>
            </div>

            <div className="lg:col-span-6">
              <p className="text-sm font-medium text-ki-magenta uppercase tracking-[0.14em] mb-4">
                Spec grades
              </p>
              <ul className="space-y-3 font-mono text-sm md:text-base text-ki-ground">
                {['Rutile R2310', 'RS Type 15/20', 'Red 57:1'].map((grade) => (
                  <li
                    key={grade}
                    className="flex items-center gap-4 border-b border-ki-green/15 pb-3"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-ki-orange shrink-0" aria-hidden="true" />
                    {grade}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="dark" className="py-20 md:py-28">
        <Container>
          <div className="max-w-2xl mx-auto mb-14 text-center">
            <p className="text-sm font-medium text-ki-orange uppercase tracking-[0.14em] mb-3">
              Our process
            </p>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight leading-[1.05]">
              How we work
            </h2>
            <p className="mt-4 text-slate-300 leading-[1.65] text-lg">
              From first formulation to the batch on your press — three steps, one shade.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5 list-none p-0 m-0">
            {processSteps.map((item, index) => (
              <li
                key={item.step}
                className={clsx(
                  'relative border border-white/10 bg-slate-900/60 px-6 py-8 text-center',
                  'shadow-[6px_6px_0_0_rgba(246,147,30,0.25)]'
                )}
              >
                <span className="font-mono text-ki-orange text-sm tracking-widest mb-4 block">
                  {item.step}
                </span>
                <h3 className="text-2xl font-bold font-heading uppercase tracking-wide text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm leading-[1.65]">{item.body}</p>
                {index < processSteps.length - 1 && (
                  <span
                    className="hidden md:block absolute top-1/2 -right-3 h-px w-3 bg-ki-orange/60"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="dark" className="py-20 md:py-24 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(246,147,30,0.12),transparent_50%)]" />
        <Container className="relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-5 text-white tracking-tight">
            Ready for the right series?
          </h2>
          <p className="text-slate-300 mb-10 text-lg max-w-xl mx-auto leading-[1.65]">
            Tell us your substrate and application — or send a sample to match.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to="/contact?intent=quote"
              onClick={() => trackEvent('cta_quote_click', { location: 'home_cta' })}
            >
              Get a Quote <CheckCircle className="h-5 w-5" />
            </Button>
            <Button
              href={WHATSAPP_URL}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'home_cta' })}
              className="!text-white !border-ki-green hover:!bg-ki-green"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Home;
