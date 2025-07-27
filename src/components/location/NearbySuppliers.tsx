import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, MessageSquare, Package, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Supplier {
  id: string;
  business_name: string;
  contact_person: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  total_ratings: number;
  is_verified: boolean;
  latitude?: number;
  longitude?: number;
  distance?: number;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  name_hindi?: string;
  price_per_unit: number;
  unit: string;
  stock_quantity: number;
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  name_hindi?: string;
}

const NearbySuppliers = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [maxDistance, setMaxDistance] = useState('10');

  useEffect(() => {
    fetchCategories();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbySuppliers();
    }
  }, [userLocation, selectedCategory, sortBy, maxDistance]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to Delhi coordinates for demo
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
          toast({
            title: "Location Access",
            description: "Using default location. Enable location services for better results.",
            variant: "default"
          });
        }
      );
    } else {
      // Fallback for browsers without geolocation
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchNearbySuppliers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          products(
            id,
            name,
            name_hindi,
            price_per_unit,
            unit,
            stock_quantity,
            category:categories(name)
          )
        `)
        .eq('user_type', 'supplier')
        .eq('is_verified', true);

      if (selectedCategory) {
        query = query.contains('products.category_id', [selectedCategory]);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate distances and filter by max distance
      const suppliersWithDistance = (data || [])
        .map(supplier => {
          const distance = supplier.latitude && supplier.longitude && userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                supplier.latitude,
                supplier.longitude
              )
            : Math.random() * 15; // Random distance for demo if no coordinates

          return {
            ...supplier,
            distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
          };
        })
        .filter(supplier => supplier.distance <= parseInt(maxDistance));

      // Sort suppliers
      const sortedSuppliers = suppliersWithDistance.sort((a, b) => {
        switch (sortBy) {
          case 'distance':
            return a.distance - b.distance;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.business_name.localeCompare(b.business_name);
          default:
            return 0;
        }
      });

      setSuppliers(sortedSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to load nearby suppliers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (supplierId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('vendor_id', profile.id)
        .eq('supplier_id', supplierId)
        .single();

      if (existingRoom) {
        toast({
          title: "Chat Opened",
          description: "Existing conversation found",
        });
        return;
      }

      const { error } = await supabase
        .from('chat_rooms')
        .insert({
          vendor_id: profile.id,
          supplier_id: supplierId
        });

      if (error) throw error;

      toast({
        title: "Chat Started",
        description: "New conversation created successfully",
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive"
      });
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.products?.some(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_hindi?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nearby Suppliers</h2>
        <p className="text-muted-foreground">Discover verified suppliers in your area</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} {category.name_hindi && `(${category.name_hindi})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={maxDistance} onValueChange={setMaxDistance}>
              <SelectTrigger>
                <SelectValue placeholder="Max distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Within 5 km</SelectItem>
                <SelectItem value="10">Within 10 km</SelectItem>
                <SelectItem value="20">Within 20 km</SelectItem>
                <SelectItem value="50">Within 50 km</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden hover-scale animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.business_name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {supplier.distance}km away • {supplier.city}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {supplier.is_verified && (
                      <Badge variant="default" className="text-xs">Verified</Badge>
                    )}
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                      <span className="text-xs">{supplier.rating} ({supplier.total_ratings})</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">{supplier.contact_person}</p>
                    <p className="text-xs text-muted-foreground">{supplier.phone}</p>
                  </div>

                  {/* Products Preview */}
                  {supplier.products && supplier.products.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Available Products:</p>
                      <div className="space-y-1">
                        {supplier.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center justify-between text-xs">
                            <span className="flex items-center">
                              <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                              {product.name}
                            </span>
                            <span className="font-medium text-primary">
                              ₹{product.price_per_unit}/{product.unit}
                            </span>
                          </div>
                        ))}
                        {supplier.products.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{supplier.products.length - 3} more products
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => startChat(supplier.id)}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Products
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or increasing the distance range
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NearbySuppliers;