# Logo Assets

This directory contains the logo files for the Benedicto College Library Management System.

## Current Logo

- **benedicto-college-logo.svg** - Main logo used in headers (SVG format for scalability)

## How to Replace with Your School Logo

### Option 1: Replace the SVG file
1. Create your school logo in SVG format
2. Name it `benedicto-college-logo.svg`
3. Replace the existing file in this directory
4. Recommended dimensions: 120x60 pixels (2:1 ratio)

### Option 2: Use a different image format
1. Add your logo file (PNG, JPG, or SVG) to this directory
2. Update the image source in both files:
   - `src/app/login/login.html` (line ~28)
   - `src/app/landing/landing.html` (line ~8)
3. Change the `src` attribute to point to your new logo file

### Logo Requirements

- **Format**: SVG preferred (scalable), PNG/JPG acceptable
- **Size**: Recommended height 60-80px for optimal display
- **Background**: Transparent or white background works best
- **Colors**: Should work well on dark backgrounds (header is dark gray)

### Example Update

If you have a logo named `my-school-logo.png`, update the image tags:

```html
<img 
  src="assets/images/my-school-logo.png" 
  alt="My School Logo" 
  class="h-12 sm:h-14 lg:h-16 w-auto"
>
```

### Responsive Sizing

The logo automatically scales across different screen sizes:
- Mobile: `h-12` (48px)
- Tablet: `h-14` (56px) 
- Desktop: `h-16` (64px)

You can adjust these classes in the HTML files if needed.
