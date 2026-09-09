export const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'ink-series', label: 'Ink Series' },
  { id: 'ink-processes', label: 'Ink Processes' },
  { id: 'solvents', label: 'Solvents & Blends' },
  { id: 'industry-products', label: 'Printing Ink Industry Products' },
];

export function getCategoryLabel(categoryId) {
  return categories.find((c) => c.id === categoryId)?.label ?? categoryId;
}

export const productsData = [
  // —— Ink Series (hexagon flyer) ——
  {
    id: 'lam-series',
    slug: 'lam-series',
    name: 'LAM Series',
    kind: 'series',
    category: 'ink-series',
    description:
      'Ink series for flexible food packaging such as snack packs, biscuit wrappers, and confectionery pouches.',
    applications: ['Snack packaging', 'Biscuit wrappers', 'Chocolate & confectionery packs'],
    process: 'Rotogravure',
    printMode: 'Reverse lamination',
    substrates: ['PET', 'BOPP'],
    structures: ['PET+BOPP', 'BOPP+MOPP', 'PET+MCPP', 'PET+LDPE'],
    notes: ['General-purpose lamination', 'PE up to 50µm'],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'h-lam-series',
    slug: 'h-lam-series',
    name: 'H-LAM Series',
    kind: 'series',
    category: 'ink-series',
    description:
      'Ink series for stand-up pouches and larger flexible bags used for tea, laundry powder, and dried foods.',
    applications: ['Stand-up pouches', 'Tea packaging', 'Laundry powder bags', 'Dried food pouches'],
    process: 'Rotogravure',
    printMode: 'Reverse lamination',
    substrates: ['PET', 'BOPP'],
    structures: ['PET+BOPP', 'BOPP+MOPP', 'PET+MCPP', 'PET+LDPE'],
    notes: ['High-performance lamination', 'PE up to 150µm LDPE', '200–400 m/min'],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'pel-series',
    slug: 'pel-series',
    name: 'PEL Series',
    kind: 'series',
    category: 'ink-series',
    description:
      'Ink series for beverage packaging including PET bottles and ice cream bar and cone wrappers.',
    applications: ['PET beverage bottles', 'Soft-drink packaging', 'Ice cream wrappers'],
    process: 'Rotogravure',
    printMode: 'Surface',
    substrates: ['Pearlized OPP', 'BOPP', 'LDPE'],
    notes: ['Deep-freeze resistant', 'BOPP corona 38–42 dyn/cm'],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'max-series',
    slug: 'max-series',
    name: 'MAX Series',
    kind: 'series',
    category: 'ink-series',
    description:
      'Ink series for rigid plastic bottles and containers — juices, household detergents and cleaners, and personal-care bottles.',
    applications: ['Juice bottles', 'Detergent bottles', 'Household cleaners', 'Shampoo & personal-care bottles'],
    process: 'Rotogravure',
    printMode: 'Surface',
    substrates: ['PET', 'MPET', 'BOPP', 'CPP', 'LDPE'],
    notes: [
      'Toluene-based economy',
      'OPP/LDPE corona 38–42 dyn/cm',
      'PET corona 48–52 dyn/cm',
    ],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'peak-series',
    slug: 'peak-series',
    name: 'PEAK Series',
    kind: 'series',
    category: 'ink-series',
    description:
      'Ink series for large-format flexible bags used for bulk commodities such as rice, grain, and animal feed.',
    applications: ['Rice bags', 'Grain packaging', 'Animal feed bags', 'Bulk commodity bags'],
    process: 'Flexographic',
    printMode: 'Surface',
    substrates: ['PE', 'BOPP'],
    notes: ['High-speed CI flexo', 'Scratch/rub resistant', 'Low COF'],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'kwb-series',
    slug: 'kwb-series',
    name: 'KWB Series',
    kind: 'series',
    category: 'ink-series',
    description:
      'Ink series for corrugated cardboard and commercial shipping box packaging.',
    applications: ['Corrugated boxes', 'Shipping cartons', 'Commercial packaging'],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'dgi-series',
    slug: 'dgi-series',
    name: 'DGI Series',
    kind: 'series',
    category: 'ink-series',
    description:
      'Ink series for personal care and hygiene packaging such as diapers, sanitary napkins, and tissue packs.',
    applications: ['Diaper packaging', 'Sanitary napkin wraps', 'Tissue packaging'],
    tdsUrl: null,
    sdsUrl: null,
  },

  // —— Ink Processes (main category flyer) ——
  {
    id: 'rotogravure-inks',
    slug: 'rotogravure-inks',
    name: 'Rotogravure Solvent-Based Inks',
    kind: 'process',
    category: 'ink-processes',
    description:
      'Rotogravure solvent-based ink solutions for packaging print. Contact sales for available grades and TDS.',
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'flexographic-inks',
    slug: 'flexographic-inks',
    name: 'Flexographic Solvent-Based Inks',
    kind: 'process',
    category: 'ink-processes',
    description:
      'Flexographic solvent-based ink solutions for packaging print. Contact sales for available grades and TDS.',
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'water-based-inks',
    slug: 'water-based-inks',
    name: 'Water Based Inks',
    kind: 'process',
    category: 'ink-processes',
    description:
      'Water-based ink solutions for packaging print. Contact sales for available grades and TDS.',
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'offset-inks',
    slug: 'offset-inks',
    name: 'Offset Inks',
    kind: 'process',
    category: 'ink-processes',
    description:
      'Offset ink solutions for commercial and packaging print. Contact sales for available grades and TDS.',
    tdsUrl: null,
    sdsUrl: null,
  },

  // —— Solvents & Blends ——
  {
    id: 'solvents-blends',
    slug: 'solvents-blends',
    name: 'Solvents & Blends',
    kind: 'chemical',
    category: 'solvents',
    description: 'Industrial solvents and blends for printing ink applications.',
    items: ['Ethyl Acetate', 'IPA', 'NPAC', 'Ethylene Glycol', 'Unisol'],
    tdsUrl: null,
    sdsUrl: null,
  },

  // —— Printing Ink Industry Products ——
  {
    id: 'pigments',
    slug: 'pigments',
    name: 'High Performance Pigments for Ink',
    kind: 'chemical',
    category: 'industry-products',
    description: 'High-performance pigments for printing ink manufacture.',
    items: [
      'Pigment Yellow (Yellow 14)',
      'Pigment Rubine 4BL (Red 57:1)',
      'Pigment Blue (Blue 15:4)',
      'Carbon Black N-326 / 317P',
    ],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'titanium-dioxide',
    slug: 'titanium-dioxide',
    name: 'Titanium Dioxide',
    kind: 'chemical',
    category: 'industry-products',
    description: 'Rutile titanium dioxide grades for printing ink formulations.',
    items: [
      'Rutile R2310 (Germany)',
      'Rutile R2300 (Germany)',
      'Rutile ZR-969 / PNR-626 / B-818',
    ],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'resins',
    slug: 'resins',
    name: 'Resins',
    kind: 'chemical',
    category: 'industry-products',
    description: 'Resin systems for printing ink binders.',
    items: [
      'Polyamide Alcohol / Co-Solvent',
      'Ketone KTR-100',
      'Maleic',
      'PU Resin',
    ],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'nitrocellulose',
    slug: 'nitrocellulose',
    name: 'Nitrocellulose',
    kind: 'chemical',
    category: 'industry-products',
    description: 'Nitrocellulose grades for solvent-based ink systems.',
    items: ['RS Type ¼', 'RS Type 15/20', 'SS Type 1/8'],
    tdsUrl: null,
    sdsUrl: null,
  },
  {
    id: 'solvent-dyes',
    slug: 'solvent-dyes',
    name: 'Solvent Dyes',
    kind: 'chemical',
    category: 'industry-products',
    description: 'Solvent dye shades for ink and related formulations.',
    items: ['Y-82', 'Red-122', 'Red-8', 'Blue-70', 'Black-7'],
    tdsUrl: null,
    sdsUrl: null,
  },
];

export function getProductBySlug(slug) {
  return productsData.find((p) => p.slug === slug);
}
