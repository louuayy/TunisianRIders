# Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML5, CSS3, and vanilla JavaScript. This portfolio showcases skills, experience, and projects with beautiful animations and interactive features.

## 🌟 Features

### Design & UI
- **Modern Design**: Clean, professional layout with gradient accents
- **Responsive**: Fully responsive design that works on all devices
- **Smooth Animations**: CSS animations and JavaScript interactions
- **Dark Mode**: Toggle between light and dark themes
- **Typography**: Beautiful Inter font family for excellent readability

### Sections
- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **About**: Personal information with animated statistics
- **Skills**: Organized skill categories with hover effects
- **Projects**: Featured projects with overlay effects and technology tags
- **Experience**: Timeline-based work history
- **Contact**: Contact form with validation and contact information

### Interactive Features
- **Smooth Scrolling**: Seamless navigation between sections
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Scroll Animations**: Elements animate as they come into view
- **Typing Effect**: Animated typing effect for the hero title
- **Form Validation**: Contact form with real-time validation
- **Parallax Effects**: Subtle parallax scrolling effects
- **Hover Effects**: Interactive hover states for cards and buttons

### Performance & Accessibility
- **Optimized Performance**: Throttled scroll events and lazy loading
- **Keyboard Navigation**: Full keyboard accessibility
- **SEO Friendly**: Semantic HTML structure
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- A text editor (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Installation
1. Clone or download the portfolio files
2. Open `index.html` in your web browser
3. Customize the content with your personal information

### File Structure
```
portfolio/
├── index.html          # Main HTML file
├── styles/
│   └── main.css        # All CSS styles
├── scripts/
│   └── main.js         # JavaScript functionality
└── README.md           # This file
```

## ✏️ Customization

### Personal Information
Replace the placeholder content in `index.html`:

1. **Hero Section**:
   - Change "Your Name" to your actual name
   - Update the subtitle and description
   - Replace the profile image URL

2. **About Section**:
   - Update the about description
   - Modify the statistics (projects, experience, etc.)
   - Replace the about image

3. **Skills Section**:
   - Add/remove skill categories
   - Update skill items and icons
   - Customize the skill list

4. **Projects Section**:
   - Replace project images and descriptions
   - Update project links (live demo and GitHub)
   - Modify technology tags

5. **Experience Section**:
   - Update job titles, companies, and dates
   - Modify job descriptions
   - Update skill badges

6. **Contact Section**:
   - Update contact information (email, phone, location)
   - Modify social media links
   - Customize the contact form

### Colors and Styling
The website uses CSS custom properties for easy color customization. Main colors are defined in the CSS:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Background gradients */
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
```

### Images
Replace placeholder images with your own:
- Profile photo in hero section
- About section image
- Project screenshots
- Update image alt texts for accessibility

## 🎨 Customization Tips

### Adding New Sections
1. Add the HTML structure in `index.html`
2. Add corresponding styles in `main.css`
3. Update navigation links
4. Add scroll animations in `main.js`

### Modifying Animations
- Adjust animation durations in CSS
- Modify scroll animation triggers in JavaScript
- Customize hover effects and transitions

### Responsive Design
The website is mobile-first responsive. Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Technical Details

### Dependencies
- **Font Awesome**: Icons (loaded via CDN)
- **Google Fonts**: Inter font family (loaded via CDN)
- **No JavaScript frameworks**: Pure vanilla JavaScript

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Features
- **Throttled scroll events**: Optimized for 60fps
- **Intersection Observer**: Efficient scroll animations
- **Lazy loading**: Images load when needed
- **CSS transforms**: Hardware-accelerated animations

## 📱 Mobile Features
- Touch-friendly navigation
- Optimized touch targets
- Responsive images
- Mobile-optimized forms
- Swipe-friendly project cards

## 🌙 Dark Mode
The portfolio includes an optional dark mode toggle:
- Automatic preference saving
- Smooth theme transitions
- Accessible color contrasts
- System preference detection

## 📧 Contact Form
The contact form includes:
- Real-time validation
- Email format checking
- Success/error notifications
- Accessible form labels
- Responsive design

**Note**: The form currently shows a success message but doesn't actually send emails. To make it functional, you'll need to:
1. Set up a backend service (Node.js, PHP, etc.)
2. Configure email sending (SMTP, SendGrid, etc.)
3. Update the form submission handler in `main.js`

## 🚀 Deployment

### GitHub Pages
1. Create a GitHub repository
2. Upload your portfolio files
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Create a Netlify account
2. Drag and drop your portfolio folder
3. Your site will be deployed automatically

### Vercel
1. Create a Vercel account
2. Import your GitHub repository
3. Deploy with one click

## 🎯 SEO Optimization
- Semantic HTML structure
- Meta descriptions and titles
- Alt text for images
- Structured data markup (recommended)
- Fast loading times
- Mobile-friendly design

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing
Feel free to fork this project and customize it for your own use. If you make improvements that could benefit others, pull requests are welcome!

## 📞 Support
If you have questions or need help customizing your portfolio, feel free to reach out or open an issue.

---

**Happy coding!** 🚀