// Carousel.jsx - Carousel component for the homepage
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Carousel.css';

const Carousel = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Default slides if none are provided
  const defaultSlides = [
    {
      image: '../assets/images/Super Mario Land Adv_.gif',
      title: 'Discover Your Gaming Community',
      description: 'Join Game Tribe and connect with gamers worldwide.',
      buttonText: 'Join Now',
      buttonLink: '/profile',
      alignment: 'text-start'
    },
    {
      image: '../assets/images/Day in the Life.jpg',
      title: 'Explore New Gaming Experiences',
      description: 'Find your next favorite game and team up with like-minded players.',
      buttonText: 'Browse Games',
      buttonLink: '/search',
      alignment: 'text-center'
    },
    {
      image: '../assets/images/PowerPuff Girls.jpg',
      title: 'Shop Shop and More Shopping',
      description: 'Buy games and play offline',
      buttonText: 'View Cart',
      buttonLink: '/cart',
      alignment: 'text-end'
    }
  ];

  // Use provided slides or default ones
  const carouselSlides = slides || defaultSlides;

  // Auto-advance slides
  const nextSlide = useCallback(() => {
    const newIndex = activeIndex === carouselSlides.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
  }, [activeIndex, carouselSlides.length]);

  // Previous slide
  const prevSlide = () => {
    const newIndex = activeIndex === 0 ? carouselSlides.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
  };

  // Handle indicator clicks
  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Set up auto-advance
  useEffect(() => {
    let interval;
    
    if (!paused) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Advance every 5 seconds
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [nextSlide, paused]);

  return (
    <div 
      id="myCarousel" 
      className="carousel slide mb-6" 
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {carouselSlides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            type="button"
            className={activeIndex === index ? 'active' : ''}
            aria-current={activeIndex === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
      
      {/* Slides */}
      <div className="carousel-inner">
        {carouselSlides.map((slide, index) => (
          <div 
            key={`slide-${index}`}
            className={`carousel-item ${activeIndex === index ? 'active' : ''}`}
          >
            <img src={slide.image} alt={`Slide ${index + 1}`} />
            <div className={`carousel-caption ${slide.alignment}`}>
              <h1>{slide.title}</h1>
              <p className="opacity-75">{slide.description}</p>
              <p>
                <Link className="btn btn-lg btn-primary" to={slide.buttonLink}>
                  {slide.buttonText}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <button 
        className="carousel-control-prev" 
        type="button" 
        onClick={prevSlide}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button 
        className="carousel-control-next" 
        type="button" 
        onClick={nextSlide}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;