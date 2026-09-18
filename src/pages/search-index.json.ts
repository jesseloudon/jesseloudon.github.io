import { getCollection } from 'astro:content';
import { articlePath } from '../lib/site';

export async function GET() {
  const posts = await getCollection('posts');
  const entries = posts.map((post) => ({
    title: post.data.title,
    category: post.data.categories?.[0] || 'Article',
    excerpt: post.data.excerpt || '',
    url: articlePath(post),
    text: `${post.data.title} ${post.data.excerpt || ''} ${post.body || ''}`
  }));

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' }
  });
}
