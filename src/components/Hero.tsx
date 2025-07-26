import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/hero-street-food.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-warm overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Street food vendors"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary font-medium">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Connecting India's Street Food Ecosystem</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  SupplySetu
                </span>
                <br />
                <span className="text-foreground">सप्लाई सेतु</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Empowering street food vendors with direct access to trusted suppliers. 
                Get better prices, quality ingredients, and save time on procurement.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1200+</div>
                <div className="text-sm text-muted-foreground">Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">₹15L+</div>
                <div className="text-sm text-muted-foreground">Saved</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8">
                Start as Vendor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Join as Supplier
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" />
                <span>Verified Suppliers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>Hyper-Local</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-6 shadow-warm border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Today's Best Prices</h3>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                    Live Updates
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-xs font-bold text-white">
                        🧅
                      </div>
                      <div>
                        <div className="font-medium">Onions</div>
                        <div className="text-xs text-muted-foreground">Per kg</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹25</div>
                      <div className="text-xs text-accent">↓ ₹3 saved</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-xs font-bold text-white">
                        🍅
                      </div>
                      <div>
                        <div className="font-medium">Tomatoes</div>
                        <div className="text-xs text-muted-foreground">Per kg</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹40</div>
                      <div className="text-xs text-accent">↓ ₹5 saved</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-xs font-bold text-white">
                        🌶️
                      </div>
                      <div>
                        <div className="font-medium">Green Chili</div>
                        <div className="text-xs text-muted-foreground">Per kg</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹80</div>
                      <div className="text-xs text-accent">↓ ₹8 saved</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-primary hover:opacity-90" size="sm">
                  View All Prices
                </Button>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium shadow-glow">
              Real-time prices
            </div>
            <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Trusted suppliers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;