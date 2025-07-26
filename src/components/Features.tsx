import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  TrendingUp, 
  Shield, 
  Bell, 
  MessageCircle, 
  Brain,
  Clock,
  Star,
  Phone
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Hyper-Local Discovery",
      description: "Find verified suppliers within 5km radius with real-time availability",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: TrendingUp,
      title: "Live Price Comparison",
      description: "Compare prices across multiple suppliers instantly and get the best deals",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Shield,
      title: "Trust Score System",
      description: "Verified suppliers with ratings, reviews, and quality certifications",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Bell,
      title: "Smart Price Alerts",
      description: "Get notified when prices drop for your frequently ordered items",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Brain,
      title: "AI Inventory Suggestions",
      description: "Smart recommendations based on your past orders and festival demands",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Phone,
      title: "Voice Ordering",
      description: "Place orders using voice commands in Hindi, Telugu, Tamil, and more",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Direct communication with suppliers for negotiations and updates",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Clock,
      title: "Quick Order History",
      description: "Reorder your regular items with just one tap from order history",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Star,
      title: "Bulk Order Discounts",
      description: "Special pricing for bulk orders and loyalty program benefits",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to streamline your supply chain and boost your street food business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-warm hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;