import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { articlePath } from '../lib/site';
/** @type {import('astro').APIRoute} */
export async function GET(context) {
  const posts = (await getCollection('posts')).sort((a,b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Jesse Loudon',
    description: 'Azure, DevOps, AI, and cloud governance notes.',
    site: context.site,
    items: posts.map((post) => ({ title: post.data.title, pubDate: post.data.date, description: post.data.excerpt, link: articlePath(post) }))
  });
}
