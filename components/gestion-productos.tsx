'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, ArrowUpDown, Edit, Trash, AlertTriangle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Product {
  id: number
  name: string
  quantity: number
  price: number
  expirationDate: string
  ingressDate: string
  description?: string
}

export default function GestionProductos() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Salmón', quantity: 500, price: 15.00, expirationDate: '2024-12-15', ingressDate: '2024-01-01' },
    { id: 2, name: 'Atún', quantity: 450, price: 13.00, expirationDate: '2024-12-20', ingressDate: '2024-01-02' },
    { id: 3, name: 'Bacalao', quantity: 300, price: 11.00, expirationDate: '2024-12-18', ingressDate: '2024-01-03' },
    { id: 4, name: 'Trucha', quantity: 250, price: 12.50, expirationDate: '2024-12-22', ingressDate: '2024-01-04' },
    { id: 5, name: 'Merluza', quantity: 200, price: 10.00, expirationDate: '2024-12-25', ingressDate: '2024-01-05' },
    { id: 6, name: 'Dorada', quantity: 180, price: 14.50, expirationDate: '2024-12-28', ingressDate: '2024-01-06' },
    { id: 7, name: 'Lubina', quantity: 220, price: 16.00, expirationDate: '2024-12-30', ingressDate: '2024-01-07' },
    { id: 8, name: 'Rodaballo', quantity: 150, price: 18.00, expirationDate: '2024-12-31', ingressDate: '2024-01-08' },
    { id: 9, name: 'Rape', quantity: 100, price: 20.00, expirationDate: '2024-12-29', ingressDate: '2024-01-09' },
    { id: 10, name: 'Lenguado', quantity: 120, price: 22.00, expirationDate: '2024-12-27', ingressDate: '2024-01-10' },
    { id: 11, name: 'Boquerón', quantity: 600, price: 8.00, expirationDate: '2024-12-26', ingressDate: '2024-01-11' },
    { id: 12, name: 'Sardina', quantity: 550, price: 7.50, expirationDate: '2024-12-24', ingressDate: '2024-01-12' },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof Product>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleSort = (column: keyof Product) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortColumn === 'expirationDate' || sortColumn === 'ingressDate') {
      const aDate = new Date(a[sortColumn]);
      const bDate = new Date(b[sortColumn]);
      return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    }
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
    if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  })

  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'ingressDate'>) => {
    const id = Math.max(...products.map(p => p.id), 0) + 1
    const ingressDate = new Date().toISOString().split('T')[0]
    setProducts([...products, { ...newProduct, id, ingressDate }])
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (updatedProduct: Omit<Product, 'id' | 'ingressDate'>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...updatedProduct, id: editingProduct.id, ingressDate: editingProduct.ingressDate } : p));
    }
    setIsEditDialogOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const isNearExpiration = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const expDate = new Date(parseInt(`20${year}`), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays > 0;
  };

  const isExpired = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const expDate = new Date(parseInt(`20${year}`), parseInt(month) - 1, parseInt(day));
    return expDate < new Date();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos - Pescadería</h1>
      <div className="flex justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Agregar Producto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            </DialogHeader>
            <ProductForm onSubmit={handleAddProduct} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              Nombre <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
              Cantidad <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
              Precio <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort('ingressDate')} className="cursor-pointer">
              Fecha de Ingreso <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead onClick={() => handleSort('expirationDate')} className="cursor-pointer">
              Fecha de Vencimiento <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id} className={
              isExpired(formatDate(product.expirationDate)) ? 'bg-red-100' :
              isNearExpiration(formatDate(product.expirationDate)) ? 'bg-yellow-100' : ''
            }>
              <TableCell className="py-4">{product.name}</TableCell>
              <TableCell className="py-4">{product.quantity}</TableCell>
              <TableCell className="py-4">${Number(product.price).toFixed(2)}</TableCell>
              <TableCell className="py-4">{formatDate(product.ingressDate)}</TableCell>
              <TableCell className="py-4">
                <div className="flex items-center">
                  {formatDate(product.expirationDate)}
                  {isNearExpiration(formatDate(product.expirationDate)) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 ml-2 text-yellow-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Este producto está próximo a vencer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {isExpired(formatDate(product.expirationDate)) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 ml-2 text-red-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Este producto ha vencido</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setEditingProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Producto</DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                      <ProductForm onSubmit={handleEditProduct} initialData={editingProduct} />
                    )}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="ml-2">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el producto.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'ingressDate'>) => void;
  initialData?: Product;
}

function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'ingressDate'>>(
    initialData
      ? {
          ...initialData,
          expirationDate: initialData.expirationDate,
        }
      : {
          name: '',
          quantity: 0,
          price: 0,
          expirationDate: '',
          description: '',
        }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'quantity'
          ? Number(value)
          : name === 'price'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = 

 (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del producto</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="quantity">Cantidad</Label>
        <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="price">Precio</Label>
        <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="expirationDate">Fecha de vencimiento</Label>
        <Input
          id="expirationDate"
          name="expirationDate"
          type="date"
          value={formData.expirationDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <Button type="submit">Guardar</Button>
    </form>
  )
}