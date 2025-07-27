import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  delivery_date?: string;
  delivery_address: string;
  notes?: string;
  created_at: string;
  vendor?: {
    business_name: string;
    contact_person: string;
    phone: string;
  };
  supplier?: {
    business_name: string;
    contact_person: string;
    phone: string;
  };
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    name: string;
    name_hindi?: string;
    unit: string;
    image_url?: string;
  };
}

const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      fetchOrders();
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setUserProfile(data);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const isVendor = userProfile.user_type === 'vendor';
      const filterColumn = isVendor ? 'vendor_id' : 'supplier_id';
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          vendor:profiles!vendor_id(business_name, contact_person, phone),
          supplier:profiles!supplier_id(business_name, contact_person, phone),
          order_items(
            id,
            quantity,
            unit_price,
            total_price,
            product:products(name, name_hindi, unit, image_url)
          )
        `)
        .eq(filterColumn, userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'confirmed': return 'default';
      case 'preparing': return 'secondary';
      case 'shipped': return 'secondary';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getFilteredOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const isVendor = userProfile?.user_type === 'vendor';

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="hover-scale animate-fade-in cursor-pointer" onClick={() => setSelectedOrder(order)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              {isVendor ? order.supplier?.business_name : order.vendor?.business_name}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(order.status) as any} className="flex items-center gap-1">
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">₹{order.total_amount}</span>
            <span className="text-sm text-muted-foreground">
              {order.order_items?.length || 0} items
            </span>
          </div>

          {order.delivery_date && (
            <div className="text-sm">
              <span className="text-muted-foreground">Delivery: </span>
              <span className="font-medium">
                {new Date(order.delivery_date).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="text-sm">
            <span className="text-muted-foreground">Ordered: </span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>

          {order.order_items && order.order_items.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-sm font-medium mb-2">Items:</p>
              <div className="space-y-1">
                {order.order_items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">₹{item.total_price}</span>
                  </div>
                ))}
                {order.order_items.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{order.order_items.length - 2} more items
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            {!isVendor && order.status === 'pending' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOrderStatus(order.id, 'confirmed');
                }}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                Confirm
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {isVendor ? 'Order History' : 'Customer Orders'}
        </h2>
        <p className="text-muted-foreground">
          Track your {isVendor ? 'purchases' : 'sales'} and delivery status
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'confirmed', 'preparing', 'shipped', 'delivered'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredOrders(status).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            
            {getFilteredOrders(status).length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground text-center">
                    {status === 'all' 
                      ? `No ${isVendor ? 'orders placed' : 'customer orders'} yet`
                      : `No ${status} orders at the moment`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
            <DialogDescription>
              Complete order information and status
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <Badge variant={getStatusColor(selectedOrder.status) as any} className="flex items-center gap-2">
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">₹{selectedOrder.total_amount}</p>
                </div>
              </div>

              {/* Customer/Supplier Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isVendor ? 'Supplier' : 'Customer'} Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {isVendor ? selectedOrder.supplier?.business_name : selectedOrder.vendor?.business_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Contact: {isVendor ? selectedOrder.supplier?.contact_person : selectedOrder.vendor?.contact_person}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {isVendor ? selectedOrder.supplier?.phone : selectedOrder.vendor?.phone}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-secondary/10 rounded-lg flex items-center justify-center">
                            {item.product.image_url ? (
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            {item.product.name_hindi && (
                              <p className="text-sm text-muted-foreground">{item.product.name_hindi}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              ₹{item.unit_price}/{item.product.unit} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{item.total_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p>{selectedOrder.delivery_address}</p>
                    </div>
                    {selectedOrder.delivery_date && (
                      <div>
                        <p className="text-sm text-muted-foreground">Expected Delivery</p>
                        <p>{new Date(selectedOrder.delivery_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p>{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    </div>
                    {selectedOrder.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p>{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {!isVendor && (
                <div className="flex space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                        className="flex-1 bg-gradient-primary hover:opacity-90"
                      >
                        Confirm Order
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                        variant="destructive"
                        className="flex-1"
                      >
                        Cancel Order
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      Start Preparing
                    </Button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      Mark as Shipped
                    </Button>
                  )}
                  {selectedOrder.status === 'shipped' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;