# AuraSkin Jakarta — Email Branding Guide

This guide outlines the style references and design specifications for creating HTML emails for AuraSkin Jakarta, ensuring brand consistency across all customer communications.

## 1. Brand Identity

- **Brand Name**: AuraSkin
- **Sub-Brand**: AuraSkin Jakarta
- **Tagline**: Natural Beauty. Expert Results.
- **Personality**: Luxury, Trust, Science-backed, Warmth, Empowerment
- **Location**: SCBD Tower 2, Jl. Jend. Sudirman, Jakarta Selatan 12190
- **Contact**: +62 812-8888-2828

## 2. Color Palette

Use these hex codes for HTML email design to ensure email client compatibility.

| Element | Hex Code | Name | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#0F4C5C` | Deep Emerald Teal | Main CTAs, headings, brand accent, links, headers/footers |
| **Secondary** | `#D4B483` | Champagne Gold | Highlights, star ratings, trust badges |
| **Background** | `#FAF8F4` | Warm Ivory | Main email background, section fills |
| **Accent/Divider** | `#E8DCCB` | Blush Sand | Form inputs, dividers, subtle highlight boxes |
| **Primary Text** | `#1F2937` | Graphite | Body copy, labels |
| **Muted Text** | `#6B7280` | Gray-500 | Footer text, disclaimers, secondary details |
| **White** | `#FFFFFF` | White | Inner content blocks, button text |

## 3. Typography

*Note: For HTML emails, always provide web-safe fallback fonts in your font stacks.*

- **Headings (H1, H2, H3)**
  - **Font**: Playfair Display (Web font), Georgia, serif (Fallback)
  - **Weight**: 700 (Bold)
  - **Color**: `#0F4C5C` (Primary) or `#1F2937` (Graphite)
- **Body Copy & Buttons**
  - **Font**: Inter (Web font), Arial, Helvetica, sans-serif (Fallback)
  - **Weight**: 400 / 500 (Body), 600 / 700 (Emphasis/Buttons)
  - **Color**: `#1F2937` (Graphite)

## 4. UI Components (Email Safe)

### Buttons
- **Primary CTA**: 
  - Background: `#0F4C5C`
  - Text Color: `#FFFFFF`
  - Font Weight: 600 / Bold
  - Border Radius: `6px` (`rounded-md` equivalent)
  - Padding: `12px 24px`

### Layout & Spacing
- **Container Width**: Max `600px` for optimal mobile and desktop email rendering.
- **Background Content**: Outer body background `#FAF8F4`, inner content container `#FFFFFF` with slight border or shadow if email client permits, or use simple color blocking.
- **Borders/Dividers**: Use `#E8DCCB` for horizontal rules (`<hr>`) to separate sections.
- **Border Radius**: 
  - Featured content cards: `16px` to `24px`
  - Images: `32px` for hero/feature images, if possible, or standard square/rectangles depending on client support.

## 5. Imagery & Iconography

- **Vibe**: Premium, clean, high-end medical aesthetic.
- **Icons**: Use minimal, clean SVG/PNG icons (e.g., similar to Lucide React) in the Primary (`#0F4C5C`) or Secondary (`#D4B483`) colors. 
- **Key Visuals**: Before/After documentation, clean clinic environments, professional staff, trust badges (certifications).

## 6. Content & Tone of Voice

- **Confident & Expert**: Direct language ("Board-Certified", "FDA Approved").
- **Warm & Empathetic**: Caring, patient-first approach ("We care about your skin goals"). No clinical-cold language.
- **Premium**: Avoid discount-heavy language. Lead with value, results, and expertise.
- **Clear & Concise**: Short sentences, easy to scan, no medical jargon.
- **Trustworthy**: Quantify claims ("20,000+ Treatments", "4.9 ⭐ Rating").

## 7. Email Footer Requirements

Always include the following in the email footer (`#6B7280` / Muted Text):
- AuraSkin Jakarta Logo
- Clinic Address (SCBD Tower 2, Jl. Jend. Sudirman, Jakarta Selatan 12190)
- Contact Info (+62 812-8888-2828)
- Social Links (Instagram)
- Unsubscribe Link (Legal requirement)
