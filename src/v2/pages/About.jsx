import { motion } from 'framer-motion';
import { Award, Users, MapPin, Target, History, Factory, Eye } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHeader, Container, Card, Section } from '../components/ui';

const About = () => {
  return (
    <div className="min-h-screen pb-0">
      <SEO
        title="About"
        description="Klassico Inks — liquid printing inks since January 2018, under Mahmood Brothers. Shade matching for packaging substrates and processes."
        path="/about"
      />

      <PageHeader
        tone="dark"
        title={
          <>
            Liquid inks since{' '}
            <span className="text-ki-orange">2018</span>
          </>
        }
        description="Special-application printing inks for packaging — matched shade by shade to your substrate and process."
      />

      {/* Mission / vision — dark */}
      <Section tone="dark" className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <Card tone="dark" className="p-8">
              <div className="bg-ki-orange/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-ki-orange" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white mb-4">Our Mission</h3>
              <p className="text-slate-300 leading-[1.65]">
                To provide printing ink solutions that enhance the value of our customers&apos;
                products through technical expertise and batch-to-batch consistency.
              </p>
            </Card>
            <Card tone="dark" className="p-8">
              <div className="bg-ki-green/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Eye className="h-6 w-6 text-ki-orange" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white mb-4">Our Vision</h3>
              <p className="text-slate-300 leading-[1.65]">
                To be the preferred partner for the packaging industry globally, recognized for our
                technical expertise and ethical business standards.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* History — paper */}
      <Section tone="paper" className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <History className="h-6 w-6 text-ki-orange" />
                <h2 className="text-3xl font-bold font-heading text-ki-ground">Our History</h2>
              </div>
              <p className="text-slate-700 leading-[1.65]">
                We started the liquid ink business in <strong>January 2018</strong> under the
                brand name Klassico Inks, part of <strong>Mahmood Brothers</strong>. What began
                as general-purpose printing inks has grown into special-application series for
                rotogravure, flexographic, water-based, and offset processes.
              </p>
              <p className="text-slate-700 leading-[1.65]">
                We match shades from a printed pack, wet ink sample, or Pantone reference —
                using the equipment and process your job actually runs.
              </p>
              <p className="text-slate-700 leading-[1.65]">
                We manufacture at our facility in <strong>Gadoon Amazai</strong>, Khyber
                Pakhtunkhwa, with our head office in <strong>Jodia Bazar, Karachi</strong>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-video bg-white rounded-2xl overflow-hidden border border-ki-green/15 flex items-center justify-center">
                <Factory className="h-20 w-20 text-slate-300" aria-hidden="true" />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card tone="paper" className="p-8 text-center">
              <Users className="h-10 w-10 text-ki-orange mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold font-heading mb-2 text-ki-ground">Client Focus</h3>
              <p className="text-slate-600 leading-[1.65]">
                We work directly with packaging printers to match shades and solve production
                issues on their substrates.
              </p>
            </Card>
            <Card tone="paper" className="p-8 text-center">
              <Award className="h-10 w-10 text-ki-orange mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold font-heading mb-2 text-ki-ground">Quality First</h3>
              <p className="text-slate-600 leading-[1.65]">
                Rigorous quality control ensures batch-to-batch consistency for every order.
              </p>
            </Card>
            <Card tone="paper" className="p-8 text-center">
              <MapPin className="h-10 w-10 text-ki-orange mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold font-heading mb-2 text-ki-ground">Nationwide</h3>
              <p className="text-slate-600 leading-[1.65]">
                Head office in Karachi and manufacturing in Gadoon Amazai, serving printers across
                Pakistan.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default About;
