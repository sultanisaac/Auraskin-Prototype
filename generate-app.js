import fs from 'fs';
import path from 'path';

const appDir = path.join(process.cwd(), 'src', 'app');

if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

// 1. layout.tsx
const layoutContent = `import '../index.css';
import { Layout } from '../components/Layout';
import { PrototypeNotice } from '../components/PrototypeNotice';

export const metadata = {
  title: 'AuraSkin',
  description: 'Premium Skincare Clinic',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <PrototypeNotice />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}`;
fs.writeFileSync(path.join(appDir, 'layout.tsx'), layoutContent);

// 2. Routing map
const routes = {
  'page.tsx': 'Home',
  'treatments/page.tsx': 'TreatmentsPage',
  'treatments/[id]/page.tsx': 'TreatmentDetail',
  'pricing/page.tsx': 'PricingPage',
  'our-team/page.tsx': 'ExpertsPage',
  'contact/page.tsx': 'ContactPage',
  'book-consultation/page.tsx': 'BookingPage',
  'terms-of-service/page.tsx': 'TermsOfService',
  'privacy-policy/page.tsx': 'PrivacyPolicy'
};

for (const [routePath, componentName] of Object.entries(routes)) {
  const fullPath = path.join(appDir, routePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Figure out the relative path to src/pages
  const depth = routePath.split('/').length;
  const backPath = Array(depth).fill('..').join('/');

  fs.writeFileSync(fullPath, `import ${componentName} from '${backPath}/pages/${componentName}';

export default function Page() {
  return <${componentName} />;
}
`);
}

console.log('App router structure generated!');
