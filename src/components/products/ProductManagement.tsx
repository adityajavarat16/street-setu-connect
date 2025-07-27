import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  name_hindi?: string;
  description?: string;
  price_per_unit: number;
  unit: string;
  stock_quantity: number;
  minimum_order_quantity: number;
  is_available: boolean;
  category_id: string;
  image_url?: string;
  category?: {
    name: string;
    name_hindi?: string;
  };
}

interface Category {
  id: string;
  name: string;
  name_hindi?: string;
}

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    name_hindi: '',
    description: '',
    price_per_unit: '',
    unit: '',
    stock_quantity: '',
    minimum_order_quantity: '1',
    category_id: '',
    image_url: '',
    is_available: true
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user?.id)
      .single();

    if (!profile) return;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, name_hindi)
      `)
      .eq('supplier_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } else {
      setProducts(data || []);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const productData = {
        name: formData.name,
        name_hindi: formData.name_hindi || null,
        description: formData.description || null,
        price_per_unit: parseFloat(formData.price_per_unit),
        unit: formData.unit,
        stock_quantity: parseInt(formData.stock_quantity),
        minimum_order_quantity: parseInt(formData.minimum_order_quantity),
        category_id: formData.category_id,
        image_url: formData.image_url || null,
        is_available: formData.is_available,
        supplier_id: profile.id
      };

      let error;
      if (editingProduct) {
        ({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id));
      } else {
        ({ error } = await supabase
          .from('products')
          .insert([productData]));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'create'} product`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      name_hindi: product.name_hindi || '',
      description: product.description || '',
      price_per_unit: product.price_per_unit.toString(),
      unit: product.unit,
      stock_quantity: product.stock_quantity.toString(),
      minimum_order_quantity: product.minimum_order_quantity.toString(),
      category_id: product.category_id,
      image_url: product.image_url || '',
      is_available: product.is_available
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_hindi: '',
      description: '',
      price_per_unit: '',
      unit: '',
      stock_quantity: '',
      minimum_order_quantity: '1',
      category_id: '',
      image_url: '',
      is_available: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Manage your product inventory and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update your product details' : 'Add a new product to your inventory'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_hindi">Hindi Name</Label>
                  <Input
                    id="name_hindi"
                    value={formData.name_hindi}
                    onChange={(e) => setFormData({...formData, name_hindi: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({...formData, category_id: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} {category.name_hindi && `(${category.name_hindi})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price per Unit *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price_per_unit}
                    onChange={(e) => setFormData({...formData, price_per_unit: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({...formData, unit: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="gm">Gram (gm)</SelectItem>
                      <SelectItem value="ltr">Liter (ltr)</SelectItem>
                      <SelectItem value="ml">Milliliter (ml)</SelectItem>
                      <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="packet">Packet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="min_order">Min Order Qty *</Label>
                  <Input
                    id="min_order"
                    type="number"
                    value={formData.minimum_order_quantity}
                    onChange={(e) => setFormData({...formData, minimum_order_quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                />
                <Label htmlFor="available">Available for sale</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-gradient-primary hover:opacity-90">
                  {loading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover-scale">
            <div className="aspect-video bg-gradient-secondary/10 flex items-center justify-center relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground" />
              )}
              {!product.is_available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Unavailable</Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.name_hindi && (
                    <p className="text-sm text-muted-foreground">{product.name_hindi}</p>
                  )}
                </div>
                <Badge variant="outline">
                  {product.category?.name}
                </Badge>
              </div>
              
              {product.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ₹{product.price_per_unit}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    per {product.unit}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    Stock: {product.stock_quantity}
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Min: {product.minimum_order_quantity}
                  </span>
                </div>
                
                {product.stock_quantity <= 10 && (
                  <div className="flex items-center text-amber-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Low stock warning
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding your first product to your inventory
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManagement;