import fs from 'fs';
import path from 'path';

const srcComponentsDir = path.join(process.cwd(), 'src', 'components');
const srcPagesDir = path.join(process.cwd(), 'src', 'pages');

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip files that shouldn't be client components or already are
  if (content.includes('"use client"') || content.includes("'use client'")) {
    return;
  }

  // Prepend use client
  content = `"use client";\n\n` + content;

  // Replace react-router-dom imports
  if (content.includes('react-router-dom')) {
    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]react-router-dom['"];/g, (match, imports) => {
      let newImports = [];
      const hasLink = imports.includes('Link');
      const hasUseNavigate = imports.includes('useNavigate');
      const hasUseLocation = imports.includes('useLocation');
      const hasUseParams = imports.includes('useParams');

      let importStatements = [];
      if (hasLink) importStatements.push(`import Link from 'next/link';`);
      
      let nextNavigationImports = [];
      if (hasUseNavigate) nextNavigationImports.push('useRouter');
      if (hasUseLocation) nextNavigationImports.push('usePathname', 'useSearchParams');
      if (hasUseParams) nextNavigationImports.push('useParams');
      
      if (nextNavigationImports.length > 0) {
        importStatements.push(`import { ${nextNavigationImports.join(', ')} } from 'next/navigation';`);
      }
      
      return importStatements.join('\n');
    });

    // Replace useNavigate hook usage
    content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, 
      `const router = useRouter();\n  const navigate = (path) => { if (path === -1) router.back(); else router.push(path); };`);

    // Replace useLocation hook usage
    content = content.replace(/const\s+location\s*=\s*useLocation\(\);/g,
      `const pathname = usePathname();\n  const searchParams = useSearchParams();\n  const location = { pathname, search: searchParams.toString(), hash: '' };`);

    // Ensure all <Link to="..."> are changed to <Link href="...">
    content = content.replace(/<Link\s+([^>]*?)to=/g, '<Link $1href=');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
};

const processDirectory = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
};

processDirectory(srcComponentsDir);
processDirectory(srcPagesDir);

console.log('Finished processing components and pages for Next.js!');
