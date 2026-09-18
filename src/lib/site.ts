export const site = {
  title: 'Jesse Loudon',
  description: 'Azure, DevOps, AI, and policy-as-code notes from Jesse Loudon.',
  url: 'https://jloudon.com',
  social: [
    ['LinkedIn', 'https://www.linkedin.com/in/jesseloudon/'],
    ['GitHub', 'https://github.com/jesseloudon'],
    ['YouTube', 'https://www.youtube.com/channel/UCZ79IZ2ofpJhLVAOgN0n9tw'],
    ['X', 'https://twitter.com/coder_au']
  ]
};

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function slugFor(entry: { id: string }) {
  return entry.id.replace(/\.(md|markdown)$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

export function taxonomySlug(value: string) {
  return value.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

export function articlePath(entry: { id: string; data: { categories?: string[] } }) {
  const category = taxonomySlug(entry.data.categories?.[0] || 'blog');
  return `/${category}/${slugFor(entry)}/`;
}
