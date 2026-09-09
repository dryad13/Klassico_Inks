import { Beaker, Droplets, FlaskConical, Layers, Printer } from 'lucide-react';

/** Icon for a catalog product by kind (series / process / chemical). */
export function getProductIcon(product) {
  switch (product?.kind) {
    case 'series':
      return Layers;
    case 'process':
      return Printer;
    case 'chemical':
      return product.category === 'solvents' ? Beaker : FlaskConical;
    default:
      return Droplets;
  }
}
