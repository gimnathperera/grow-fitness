import { Heart, Users, Trophy } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MascotCharacter as CircleImage } from '@/components/ui/mascot-character';

export function FeaturesSection() {
  const features = [
    {
      icon: Heart,
      title: 'Fun & Engaging',
      description:
        'Interactive workouts and games designed specifically for children to make fitness enjoyable and sustainable 🎮',
      gradient: 'from-primary to-accent',
      sparkleColor: 'bg-accent',
    },
    {
      icon: Users,
      title: 'Parent Dashboard',
      description:
        "Track your child's progress, schedule sessions, and communicate with coaches all in one place 📊",
      gradient: 'from-accent to-primary',
      sparkleColor: 'bg-primary',
    },
    {
      icon: Trophy,
      title: 'Expert Coaches',
      description:
        'Certified fitness professionals specialized in child development and age-appropriate training methods 🏆',
      gradient: 'from-foreground to-primary',
      sparkleColor: 'bg-accent',
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-accent rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-primary rounded-full opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <CircleImage
              src="/images/character2.png"
              alt="Mascot 2"
              size="lg"
              withSparkles
            />
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6 font-insanibc">
            Why Choose GROW?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide a comprehensive platform for kids fitness with
            specialized tools for parents and coaches
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-primary/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <CardHeader className="text-center">
                <div
                  className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce`}
                >
                  <feature.icon className="h-10 w-10 text-white" />
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 ${feature.sparkleColor} rounded-full animate-ping`}
                  ></div>
                </div>
                <CardTitle className="text-foreground text-2xl font-insanibc">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
