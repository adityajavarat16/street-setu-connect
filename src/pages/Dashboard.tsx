import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Package, ShoppingCart, Users, TrendingUp, Bell } from 'lucide-react';
import Header from '@/components/Header';

interface Profile {
  id: string;
  user_type: string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  is_verified: boolean;
  rating: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          if (error.code === 'PGRST116') {
            // No profile found, redirect to profile setup
            navigate('/profile-setup');
          }
        } else {
          setProfile(data);
        }
      }
      setProfileLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user, navigate]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isVendor = profile.user_type === 'vendor';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {profile.contact_person}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile.business_name} • {profile.city}, {profile.state}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={profile.is_verified ? "default" : "secondary"}>
                {profile.is_verified ? "Verified" : "Pending Verification"}
              </Badge>
              <Badge variant="outline">
                {profile.rating} ⭐
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isVendor ? "Total Orders" : "Products Listed"}
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isVendor ? "Favorite Suppliers" : "Active Customers"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +3 new this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,231</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 unread
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={isVendor ? "browse" : "products"} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value={isVendor ? "browse" : "products"}>
              {isVendor ? "Browse Products" : "My Products"}
            </TabsTrigger>
            <TabsTrigger value={isVendor ? "orders" : "orders"}>
              {isVendor ? "My Orders" : "Incoming Orders"}
            </TabsTrigger>
            <TabsTrigger value="chat">Messages</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value={isVendor ? "browse" : "products"} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isVendor ? "Available Products Near You" : "Your Product Listings"}</CardTitle>
                <CardDescription>
                  {isVendor 
                    ? "Fresh supplies from verified local suppliers" 
                    : "Manage your product inventory and pricing"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden">
                      <div className="aspect-video bg-gradient-primary/10 flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">Fresh Onions</h3>
                        <p className="text-sm text-muted-foreground">Premium quality red onions</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold">₹40/kg</span>
                          <Button size="sm">
                            {isVendor ? "Order Now" : "Edit"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isVendor ? "Order History" : "Customer Orders"}</CardTitle>
                <CardDescription>
                  Track your {isVendor ? "purchases" : "sales"} and delivery status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Order #{order}0001</h4>
                        <p className="text-sm text-muted-foreground">
                          {isVendor ? "From Sharma Suppliers" : "To Raj's Street Food"}
                        </p>
                        <p className="text-sm text-muted-foreground">₹1,250 • 2 items</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={order === 1 ? "default" : order === 2 ? "secondary" : "outline"}>
                          {order === 1 ? "Delivered" : order === 2 ? "In Transit" : "Pending"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">Today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>
                  Chat with {isVendor ? "suppliers" : "vendors"} in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((chat) => (
                    <div key={chat} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold">
                          {isVendor ? "S" : "V"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {isVendor ? "Sharma Suppliers" : "Raj's Street Food"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Fresh stock available for tomorrow delivery...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">2m ago</p>
                        {chat === 1 && (
                          <Badge variant="destructive" className="text-xs">2</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Drop Alerts</CardTitle>
                <CardDescription>
                  Get notified when product prices drop below your target
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((alert) => (
                    <div key={alert} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">Fresh Tomatoes</h4>
                          <p className="text-sm text-muted-foreground">
                            Target: ₹30/kg • Current: ₹35/kg
                          </p>
                        </div>
                      </div>
                      <Badge variant={alert === 1 ? "default" : "outline"}>
                        {alert === 1 ? "Price Dropped!" : "Watching"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;