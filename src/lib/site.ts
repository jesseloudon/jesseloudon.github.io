export const site = {
  title: 'Jesse Loudon',
  description: 'Jesse Loudon is a principal cloud consultant who helps organisations shape, sell and deliver secure Azure, DevOps and AI transformation.',
  url: 'https://jloudon.com',
  social: [
    ['LinkedIn', 'https://www.linkedin.com/in/jesseloudon/'],
    ['GitHub', 'https://github.com/globalbao'],
    ['YouTube', 'https://www.youtube.com/@jesseloudon'],
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
