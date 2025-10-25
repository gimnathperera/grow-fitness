import { Trophy, Users, Heart, Award, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TestimonialCardProps {
  name: string;
  initials: string;
  childName: string;
  childAge: number;
  membershipDuration: string;
  testimonial: string;
  rating?: number;
  variant?: 'default' | 'compact';
  avatarGradient?: string;
}

function TestimonialCard({
  name,
  initials,
  childName,
  childAge,
  membershipDuration,
  testimonial,
  rating = 5,
  variant = 'default',
  avatarGradient = 'from-primary to-accent',
}: TestimonialCardProps) {
  if (variant === 'compact') {
    return (
      <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
              >
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-[#243E36]"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex mb-2">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-3 italic">{testimonial}</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{name}</p>
                <p className="text-xs text-gray-600">
                  {childName && `${childName}'s parent, age ${childAge}`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-full"></div>
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}
          >
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-white"></div>
          </div>
        </div>
        <div className="flex justify-center mb-2">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-accent fill-current" />
          ))}
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-700 mb-4 italic leading-relaxed">
          {testimonial}
        </p>
        <div className="border-t border-primary/20 pt-4">
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-gray-600">
            {childName && `${childName}'s parent, age ${childAge}`}
          </p>
          <p className="text-xs text-primary font-medium mt-1">
            {membershipDuration}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      initials: 'SJ',
      childName: 'Emma',
      childAge: 8,
      membershipDuration: 'Member for 6 months',
      testimonial:
        "Emma absolutely LOVES her sessions at GROW! She's become so much more confident and active. Coach Sarah is amazing with kids, and the progress tracking helps me see how much she's improving every week. Best decision we made!",
      avatarGradient: 'from-primary to-accent',
    },
    {
      name: 'Michael Davis',
      initials: 'MD',
      childName: 'Jake & Lily',
      childAge: 7,
      membershipDuration: 'Member for 1 year',
      testimonial:
        "My twins Jake and Lily have been going to GROW for a year now. The coaches are fantastic at keeping them engaged and motivated. They've learned teamwork, discipline, and most importantly - they have FUN! The parent dashboard is so helpful too.",
      avatarGradient: 'from-foreground to-primary',
    },
    {
      name: 'Lisa Wilson',
      initials: 'LW',
      childName: 'Sophia',
      childAge: 9,
      membershipDuration: 'Member for 8 months',
      testimonial:
        "As a working mom, I love how easy it is to track Sophia's progress and communicate with her coach through the app. She's gone from being shy to leading group activities! GROW has truly helped build her confidence and social skills.",
      avatarGradient: 'from-accent to-primary',
    },
  ];

  const compactTestimonials: Array<{
    name: string;
    initials: string;
    childName: string;
    childAge: number;
    testimonial: string;
    membershipDuration: string;
    avatarGradient?: string;
  }> = [
    {
      name: 'Rachel Chen',
      initials: 'RC',
      childName: 'Alex',
      childAge: 6,
      testimonial:
        'The coaches at GROW are incredible! They make fitness fun and age-appropriate. My son Alex has developed such a love for being active, and his coordination has improved dramatically.',
      membershipDuration: 'Member for 3 months',
      avatarGradient: 'from-primary to-foreground',
    },
    {
      name: 'David Thompson',
      initials: 'DT',
      childName: 'Maya',
      childAge: 10,
      testimonial:
        'GROW has been a game-changer for our family! Maya looks forward to every session, and I love seeing her progress reports. The community here is so supportive and welcoming.',
      membershipDuration: 'Member for 5 months',
      avatarGradient: 'from-accent to-foreground',
    },
  ];

  const trustStats = [
    {
      icon: Trophy,
      value: '4.9/5',
      label: 'Average Rating',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Users,
      value: '500+',
      label: 'Happy Families',
      color: 'text-foreground',
      bg: 'bg-accent/20',
    },
    {
      icon: Heart,
      value: '98%',
      label: 'Would Recommend',
      color: 'text-red-500',
      bg: 'bg-primary/10',
    },
    {
      icon: Award,
      value: '2024',
      label: 'Best Kids Fitness',
      color: 'text-accent',
      bg: 'bg-accent/20',
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative mascots */}
      <div className="absolute top-10 left-10 opacity-20">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-bounce">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-white"></div>
        </div>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center animate-bounce delay-300">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#243E36]"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6 font-insanibc">
            What Parents Are Saying
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from families who've experienced the GROW difference 💕
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {compactTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} variant="compact" />
          ))}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {trustStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-16 h-16 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-3`}
              >
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
