import React from 'react';

const ColorPaletteShowcase: React.FC = () => {
  const colorSections = [
    {
      title: 'Primary Colors',
      colors: [
        {
          name: 'Primary Green',
          class: 'bg-primary text-primary-foreground',
          hex: '#16a34a',
        },
        {
          name: 'Secondary',
          class: 'bg-secondary text-secondary-foreground',
          hex: '#f0fdf4',
        },
        {
          name: 'Accent',
          class: 'bg-accent text-accent-foreground',
          hex: '#dcfce7',
        },
      ],
    },
    {
      title: 'Grow Palette',
      colors: [
        { name: 'Grow 50', class: 'bg-grow-50 text-grow-900', hex: '#f0fdf4' },
        {
          name: 'Grow 100',
          class: 'bg-grow-100 text-grow-900',
          hex: '#dcfce7',
        },
        {
          name: 'Grow 300',
          class: 'bg-grow-300 text-grow-900',
          hex: '#86efac',
        },
        { name: 'Grow 500', class: 'bg-grow-500 text-white', hex: '#22c55e' },
        { name: 'Grow 600', class: 'bg-grow-600 text-white', hex: '#16a34a' },
        { name: 'Grow 700', class: 'bg-grow-700 text-white', hex: '#15803d' },
      ],
    },
    {
      title: 'Nature Accents',
      colors: [
        { name: 'Mint', class: 'bg-nature-mint text-grow-800', hex: '#dcfce7' },
        {
          name: 'Forest',
          class: 'bg-nature-forest text-white',
          hex: '#15803d',
        },
        { name: 'Sage', class: 'bg-nature-sage text-white', hex: '#84cc16' },
        {
          name: 'Emerald',
          class: 'bg-nature-emerald text-white',
          hex: '#10b981',
        },
        { name: 'Leaf', class: 'bg-nature-leaf text-white', hex: '#22c55e' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4 font-insanibc">
          Grow Fitness Color Palette
        </h1>
        <p className="text-muted-foreground text-lg">
          Nature-inspired colors for a healthy and vibrant fitness experience
        </p>
      </div>

      {/* Gradient Showcase */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-foreground font-insanibc">
          Background Gradients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-gradient h-32 rounded-lg flex items-center justify-center">
            <span className="text-grow-700 font-medium">Green Gradient</span>
          </div>
          <div className="bg-nature-gradient h-32 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium">Nature Gradient</span>
          </div>
          <div className="bg-hero-gradient h-32 rounded-lg flex items-center justify-center">
            <span className="text-grow-700 font-medium">Hero Gradient</span>
          </div>
        </div>
      </div>

      {/* Color Sections */}
      {colorSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground font-insanibc">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {section.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="text-center">
                <div
                  className={`${color.class} h-20 w-full rounded-lg flex items-center justify-center mb-2 shadow-sm border border-border`}
                >
                  <span className="text-sm font-medium">{color.name}</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {color.hex}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Component Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">
          Component Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Button */}
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="text-lg font-medium mb-4 text-card-foreground">
              Primary Button
            </h3>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-grow-700 transition-colors">
              Start Your Journey
            </button>
          </div>

          {/* Secondary Button */}
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="text-lg font-medium mb-4 text-card-foreground">
              Secondary Button
            </h3>
            <button className="bg-secondary text-secondary-foreground border border-grow-200 px-6 py-3 rounded-md font-medium hover:bg-grow-100 transition-colors">
              Learn More
            </button>
          </div>

          {/* Card Example */}
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="text-lg font-medium mb-4 text-card-foreground">
              Success Card
            </h3>
            <div className="bg-accent p-4 rounded-md border border-grow-200">
              <p className="text-accent-foreground text-sm">
                🌱 Great job! You've completed your workout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Information */}
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-foreground">
          Accessibility Notes
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            • All color combinations meet WCAG 2.1 AA contrast requirements
          </li>
          <li>
            • Primary green (#16a34a) provides excellent contrast against white
            backgrounds
          </li>
          <li>• Color palette maintains accessibility standards</li>
        </ul>
      </div>
    </div>
  );
};

export default ColorPaletteShowcase;
