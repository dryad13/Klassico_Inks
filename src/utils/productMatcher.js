import { productsData } from '../data/products';

const OPTIONAL_FILTERS = {
  'Toluene-free': (product) => product.tag === 'Eco-Friendly',
  'High Gloss': (product) =>
    product.features.some((f) => f.toLowerCase().includes('gloss')) || product.tag === 'Premium',
};

export function matchProducts({ substrate, application, optionalFilters = [] }) {
  if (!substrate && !application) return [];

  const scored = productsData.map((product) => {
    let score = 0;

    if (substrate && product.substrates.includes(substrate)) {
      score += 3;
    }

    if (application && product.applicationTypes.includes(application)) {
      score += 2;
    }

    for (const filter of optionalFilters) {
      const matcher = OPTIONAL_FILTERS[filter];
      if (matcher && matcher(product)) {
        score += 1;
      }
    }

    return { product, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
}
