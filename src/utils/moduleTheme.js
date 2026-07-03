const SLUG_COLORS = {
  'asesoria-imagen': 'rose',
  nutricion: 'green',
  'cuidado-piel': 'amber',
}

export function getModuleColor(slug) {
  return SLUG_COLORS[slug] ?? 'rose'
}
