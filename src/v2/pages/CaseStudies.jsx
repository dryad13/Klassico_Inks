import { ArrowRight, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHeader, Container, Button, Card } from '../components/ui';

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-ki-ground pb-20">
      <SEO
        title="Case Studies"
        description="Learn how Klassico Inks supports packaging printers. Contact us to discuss your application."
        path="/case-studies"
      />

      <PageHeader
        tone="dark"
        icon={TrendingUp}
        title="Case Studies"
        description="Detailed customer case studies will be published here. In the meantime, explore our product catalog or contact sales about your application."
      />

      <Container className="py-16">
        <Card tone="paper" className="p-10 text-center max-w-2xl mx-auto">
          <p className="text-slate-600 mb-8 leading-[1.65]">
            Case studies are not published yet. Browse the catalog or reach out with your substrate
            and process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/products">
              View Products <ArrowRight className="h-5 w-5" />
            </Button>
            <Button to="/contact?intent=quote" variant="paperGhost">
              Contact Sales
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default CaseStudies;
