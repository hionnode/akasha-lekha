import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  series: z.string().optional(),
  seriesPart: z.number().optional(),
  seriesTotal: z.number().optional(),
});

const BLOG_DIR = './src/content/blog';

let hasErrors = false;

const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

console.log(`Validating ${files.length} blog posts...\n`);

files.forEach((file) => {
  const filePath = path.join(BLOG_DIR, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  try {
    const { data } = matter(fileContent);
    blogSchema.parse(data);
    console.log(`✓ ${file}`);
  } catch (error) {
    hasErrors = true;
    console.error(`✗ ${file}`);
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(`  - ${error.message}`);
    }
    console.log('');
  }
});

if (hasErrors) {
  console.error('\n❌ Blog post validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ All blog posts are valid!');
}




