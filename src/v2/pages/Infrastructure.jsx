import { motion } from 'framer-motion';
import { Pipette, Factory, Boxes, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHeader, Container, Card, Button, Section } from '../components/ui';
import { ADDRESS } from '../../config/site';

/*
 * NOTE — content removed 2026-09-03 pending client verification.
 * Do not restore unverified lab equipment, machinery, or certification claims.
 */

const Capability = ({ icon: Icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <Card tone="dark" className="p-8 h-full">
      <div className="w-12 h-12 rounded-lg bg-ki-orange/10 flex items-center justify-center mb-5">
        <Icon className="h-6 w-6 text-ki-orange" />
      </div>
      <h3 className="text-xl font-bold font-heading text-white mb-3">{title}</h3>
      <p className="text-slate-300 leading-[1.65]">{children}</p>
    </Card>
  </motion.div>
);

const Infrastructure = () => {
  return (
    <div className="min-h-screen bg-ki-ground pb-20">
      <SEO
        title="Manufacturing & Quality"
        description="How Klassico Inks makes liquid printing inks: colour matching, batch consistency, and our Gadoon Amazai plant."
        path="/infrastructure"
      />

      <PageHeader
        tone="dark"
        title="Manufacturing & Quality"
        description="How we make ink, and how we keep it consistent from batch to batch."
      />

      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Capability icon={Factory} title="Production">
            Liquid printing inks are manufactured at our facility in{' '}
            <strong className="text-slate-200">{ADDRESS.factory}</strong>, with sales and technical
            coordination run from our head office in{' '}
            <strong className="text-slate-200">{ADDRESS.headOffice}</strong>.
          </Capability>

          <Capability icon={Pipette} title="Colour Matching">
            Send a wet sample, a printed substrate, or a Pantone reference and our team will match
            the shade for your process and substrate. Talk to us about turnaround for your job.
          </Capability>

          <Capability icon={Boxes} title="What we supply">
            Solvent-based rotogravure and flexographic inks, water-based inks, and offset inks,
            plus the solvents, pigments, titanium dioxide, resins, nitrocellulose, and solvent dyes
            used to make them.
          </Capability>
        </div>

        {/* Paper inset panel */}
        <Section
          tone="paper"
          className="rounded-2xl p-8 md:p-12 text-center border border-ki-green/15"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-ki-ground mb-4">
            Want the technical detail for your application?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-[1.65]">
            Tell us your substrate, press, and end use, and we will point you to the right series
            and share the specifications you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/contact?intent=quote">
              Contact Sales <ArrowRight className="h-5 w-5" />
            </Button>
            <Button to="/products" variant="paperGhost">
              Browse Products
            </Button>
          </div>
        </Section>
      </Container>
    </div>
  );
};

export default Infrastructure;
