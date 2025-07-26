import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, ShoppingCart, Truck } from "lucide-react";
import suppliesImage from "@/assets/fresh-supplies.jpg";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your vendor account in 2 minutes with just your mobile number",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Search,
      title: "Discover Suppliers",
      description: "Browse verified local suppliers and compare real-time prices",
      color: "text-secondary", 
      bgColor: "bg-secondary/10"
    },
    {
      icon: ShoppingCart,
      title: "Place Orders",
      description: "Order via app, voice, or chat with instant confirmations",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get fresh ingredients delivered to your stall within hours",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            How <span className="bg-gradient-primary bg-clip-text text-transparent">SupplySetu</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple steps to transform your ingredient sourcing experience
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-warm relative">
                <CardContent className="p-6">
                  <div className="relative">
                    <div className={`inline-flex p-4 rounded-full ${step.bgColor} mb-4`}>
                      <Icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-muted to-transparent transform translate-x-4" />
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Section */}
        <div className="bg-card rounded-2xl p-8 shadow-warm">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                See it in <span className="text-primary">Action</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Watch how SupplySetu helps Ramesh ji, a popular chaat vendor from Delhi, 
                save ₹500 daily and 2 hours of procurement time.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm">Found cheaper onions 500m away</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span className="text-sm">Ordered via voice in Hindi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Delivered fresh within 3 hours</span>
                </div>
              </div>

              <Button className="bg-gradient-primary hover:opacity-90">
                Watch Demo Video
              </Button>
            </div>

            <div className="relative">
              <img 
                src={suppliesImage} 
                alt="Fresh supplies"
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-lg font-semibold">Fresh & Quality Assured</div>
                <div className="text-sm opacity-90">Direct from verified suppliers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;