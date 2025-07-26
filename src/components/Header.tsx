import { Button } from "@/components/ui/button";
import { ShoppingCart, Users, Star } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SupplySetu
            </h1>
            <p className="text-xs text-muted-foreground">सप्लाई सेतु</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
            Pricing
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Vendor Login
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
            <Star className="h-4 w-4 mr-2" />
            Supplier Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;