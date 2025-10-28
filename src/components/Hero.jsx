import { useState, useEffect } from "react";
import headImage1 from "../assets/headimage.jpg";
import headImage2 from "../assets/headimage2.jpg";
import headImage3 from "../assets/headimage3.jpg";
import DarkModeToggle from "./DarkModeToggle";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Hero images
  const images = [
    { src: headImage1, alt: "Library Books Collection" },
    { src: headImage2, alt: "Reading Corner" },
    { src: headImage3, alt: "Book Collection" },
  ];

  // Famous book quotes
  const quotes = [
    {
      text: "A room without books is like a body without a soul.",
      author: "Marcus Tullius Cicero",
    },
    {
      text: "The only thing you absolutely have to know is the location of the library.",
      author: "Albert Einstein",
    },
    {
      text: "I have always imagined that Paradise will be a kind of library.",
      author: "Jorge Luis Borges",
    },
    {
      text: "Books are a uniquely portable magic.",
      author: "Stephen King",
    },
    {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin",
    },
    {
      text: "The reading of all good books is like conversation with the finest minds of past centuries.",
      author: "René Descartes",
    },
    {
      text: "There is no friend as loyal as a book.",
      author: "Ernest Hemingway",
    },
    {
      text: "Books are mirrors: you only see in them what you already have inside you.",
      author: "Carlos Ruiz Zafón",
    },
    {
      text: "Reading is to the mind what exercise is to the body.",
      author: "Joseph Addison",
    },
    {
      text: "A book is a dream that you hold in your hand.",
      author: "Neil Gaiman",
    },
  ];

  // Auto-slide functionality - 3 second intervals
  useEffect(() => {
    if (!isPlaying) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [isPlaying, images.length]);

  // Auto-quote rotation - synchronized with image changes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000); // 6 seconds = 2 image changes

    return () => clearInterval(quoteInterval);
  }, [quotes.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [images.length]);

  // Set permanent dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden dark hero-mobile"
      style={{
        height: "70vh",
        minHeight: "500px",
      }}
    >
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-3 md:p-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="glass-morphism px-4 py-2 rounded-full">
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                BookFinder
              </span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>
      </nav>

      {/* Image Slider */}
      <div
        className="carousel-container relative w-full h-full"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding container */}
        <div
          className="carousel-slides w-full h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide shrink-0 w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover select-none"
                loading={index === 0 ? "eager" : "lazy"}
                draggable="false"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom gradient overlay for smooth transition */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none hero-gradient-bottom"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)",
          }}
        />

        {/* Preload next image for smoother transitions */}
        <div className="hidden">
          {images.map((image, index) => (
            <link key={index} rel="preload" as="image" href={image.src} />
          ))}
        </div>
      </div>

      {/* Main Text Overlay - Centered on Image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 py-6 sm:px-6 sm:py-8">
        <div className="text-center w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
          <h1
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight"
            style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 0.8)" }}
          >
            Your Next Great Read
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 font-light leading-relaxed px-2 sm:px-4"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            Discover millions of books using our powerful search engine. Find by
            title, author, or genre.
          </p>
        </div>
      </div>

      {/* Quote Overlay - Positioned on Right */}
      <div className="absolute top-16 sm:top-20 md:top-1/4 right-2 sm:right-4 md:right-8 lg:right-16 xl:right-24 z-20 pointer-events-none">
        <div className="max-w-xs sm:max-w-sm md:max-w-md text-right">
          <blockquote
            className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-light text-white mb-2 sm:mb-3 leading-tight sm:leading-relaxed"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
          >
            "{quotes[currentQuote].text}"
          </blockquote>
          <cite
            className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-100 font-medium"
            style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)" }}
          >
            — {quotes[currentQuote].author}
          </cite>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center z-40">
        <button
          onClick={prevSlide}
          className="ml-6 glass-morphism p-3 rounded-full hover:scale-110 transition-all duration-300 group"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6 text-white group-hover:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center z-40">
        <button
          onClick={nextSlide}
          className="mr-6 glass-morphism p-3 rounded-full hover:scale-110 transition-all duration-300 group"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6 text-white group-hover:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/75 hover:scale-110"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && isPlaying && (
                <div className="absolute inset-0 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-18 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/80 text-sm font-medium">
            Discover Books
          </span>
          <svg
            className="w-6 h-6 text-white/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
