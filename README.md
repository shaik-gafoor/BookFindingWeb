# 📚 BookFinder - Modern Book Discovery Platform

A sleek, minimalistic book search application that helps users discover and explore books using the Open Library API. Built with modern React and featuring responsive design with dark/light mode support.

## ✨ Features

### 🎯 Core Functionality

- **Advanced Book Search**: Search by title, author, or subject with real-time results
- **Detailed Book Information**: View comprehensive book details including descriptions, publication info, and cover images
- **Smart Pagination**: Navigate through search results with smooth page transitions
- **Responsive Design**: Optimized for all device sizes from mobile to desktop

### 🎨 User Experience

- **Hero Carousel**: Beautiful rotating background images with inspirational book quotes
- **Dark/Light Mode Toggle**: Seamless theme switching with persistent user preferences
- **Glassmorphism UI**: Modern frosted glass effects and smooth animations
- **Mobile-First Design**: Touch-friendly interface with swipe gestures
- **Keyboard Navigation**: Full keyboard accessibility for hero carousel

### 🚀 Performance

- **Optimized Image Loading**: Efficient cover image handling with fallback mechanisms
- **Conservative API Usage**: Smart filtering to reduce unnecessary API calls
- **Fast Navigation**: Client-side routing with React Router
- **Responsive Images**: Adaptive image sizes based on device capabilities

## 🛠️ Tech Stack

### Frontend Framework

- **React 19.1.1** - Latest React with modern hooks and concurrent features
- **Vite 7.1.7** - Lightning-fast build tool and development server
- **React Router DOM 7.9.4** - Declarative routing for single-page applications

### Styling & UI

- **Tailwind CSS 4.1.16** - Utility-first CSS framework with custom configurations
- **CSS3 Animations** - Smooth transitions and interactive effects
- **Responsive Design** - Mobile-first approach with breakpoint optimization

### API & Data

- **Open Library API** - Comprehensive book database and search functionality
- **Archive.org Cover Images** - High-quality book cover images with fallback handling

### Development Tools

- **ESLint 9.36.0** - Code linting with React-specific rules
- **Vite Plugin React 5.0.4** - Optimized React integration with Hot Module Replacement

## 📁 Project Structure

```
BookFindingWeb/
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── Hero.jsx          # Hero carousel with quotes
│   │   ├── HomePage.jsx      # Main page layout
│   │   ├── BookSearch.jsx    # Search form component
│   │   ├── BookResults.jsx   # Search results display
│   │   ├── BookDetail.jsx    # Individual book details
│   │   └── DarkModeToggle.jsx # Theme toggle button
│   ├── context/
│   │   └── ThemeContext.jsx  # Global theme state management
│   ├── services/
│   │   └── openLibraryApi.js # API integration and utilities
│   ├── assets/               # Images and static files
│   ├── App.jsx              # Main application component
│   ├── App.css              # Global styles and responsive design
│   ├── main.jsx             # Application entry point
│   └── index.css            # Base Tailwind styles
├── eslint.config.js         # ESLint configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js          # Vite build configuration
└── package.json            # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shaik-gafoor/BookFindingWeb.git
   cd BookFindingWeb
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🎮 Usage Guide

### Basic Search

1. Use the search form to enter book titles, authors, or subjects
2. Browse through paginated results with book covers and details
3. Click on any book to view comprehensive information

### Hero Carousel

- **Auto-play**: Images and quotes rotate automatically every 3-6 seconds
- **Manual Navigation**: Use arrow buttons or keyboard arrows (←/→)
- **Mobile Gestures**: Swipe left/right on touch devices
- **Pause/Play**: Click the pause button to stop auto-rotation

### Theme Switching

- Toggle between dark and light modes using the theme button in the navigation
- Theme preference is automatically saved and restored on subsequent visits

## 🔧 Configuration

### Environment Setup

The application uses the Open Library API which doesn't require API keys. All configurations are handled internally.

### Customization Options

- **Hero Images**: Replace images in `src/assets/` directory
- **Quotes**: Modify quotes array in `Hero.jsx`
- **Styling**: Customize Tailwind classes or add custom CSS
- **API Settings**: Adjust search parameters in `openLibraryApi.js`

## 📱 Responsive Design

### Mobile Optimization

- **Compact Hero**: Reduced height (40vh) for mobile devices
- **Touch Gestures**: Swipe navigation for carousel
- **Optimized Padding**: Reduced spacing for small screens
- **Responsive Grid**: Adaptive book result layouts

### Desktop Experience

- **Full Hero**: Larger hero section (70vh) for immersive experience
- **Keyboard Navigation**: Full keyboard accessibility
- **Hover Effects**: Enhanced interactivity with mouse interactions

## 🎯 API Integration

### Open Library API Features

- **Search Endpoint**: `/search.json` for book queries
- **Book Details**: Individual book information retrieval
- **Cover Images**: High-resolution book covers from covers.openlibrary.org
- **Pagination Support**: Efficient result pagination with offset/limit

### Search Parameters

- `title`: Search by book title
- `author`: Search by author name
- `subject`: Search by book subject/genre
- `limit`: Number of results per page (default: 1000, filtered to ~10-15)
- `offset`: Pagination offset for additional results

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and formatting
- Add meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Archive.org covers may timeout - app includes fallback handling
2. **Search not working**: Check internet connection and Open Library API status
3. **Theme not persisting**: Ensure localStorage is enabled in your browser
4. **Mobile layout issues**: Clear browser cache and test on different devices

### Performance Tips

- Use specific search terms for better results
- Enable hardware acceleration in your browser
- Clear browser cache if experiencing slow loading

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open Library** - For providing the comprehensive book database API
- **Tailwind CSS** - For the utility-first CSS framework
- **React Team** - For the amazing React library and ecosystem
- **Vite Team** - For the incredibly fast build tool
- **Archive.org** - For hosting book cover images

## 📊 Project Stats

- **Components**: 7 React components
- **API Endpoints**: Open Library search and book details
- **Responsive Breakpoints**: Mobile-first design with 3 breakpoints
- **Theme Support**: Full dark/light mode with persistence
- **Image Optimization**: Fallback mechanisms for reliable loading

## 📞 Support

If you encounter any issues or have questions:

- Create an [issue](https://github.com/shaik-gafoor/BookFindingWeb/issues) on GitHub
- Check existing documentation and troubleshooting guides
- Review the code structure and component documentation

---

**Built with ❤️ using React, Tailwind CSS, and the Open Library API**

### 🚀 Live Demo

[View Live Application](https://your-demo-url.netlify.app) _(Update with your actual deployment URL)_

### 📸 Screenshots

_Add screenshots of your application in both light and dark modes, mobile and desktop views_
