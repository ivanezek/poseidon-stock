'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, ArrowUpDown, Edit, Trash, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Product {
  id: number
  name: string
  quantity: number
  price: number
  expirationDate: string
  description?: string
}

export default function GestionProductos() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Salmón', quantity: 500, price: 15.00, expirationDate: '2024-12-15' },
    { id: 2, name: 'Atún', quantity: 450, price: 13.00, expirationDate: '2024-12-20' },
    { id: 3, name: 'Bacalao', quantity: 300, price: 11.00, expirationDate: '2024-12-18' },
    { id: 4, name: 'Trucha', quantity: 250, price: 12.50, expirationDate: '2043-12-22' },
    { id: 5, name: 'Merluza', quantity: 200, price: 10.00, expirationDate: '2024-12-25' },
    { id: 6, name: 'Sardinas', quantity: 150, price: 6.00, expirationDate: '2024-12-10' },
    { id: 7, name: 'Lenguado', quantity: 100, price: 20.00, expirationDate: '2024-11-04' },
    { id: 8, name: 'Dorada', quantity: 80, price: 15.00, expirationDate: '2024-12-28' },
    { id: 9, name: 'Lubina', quantity: 75, price: 15.00, expirationDate: '2024-11-06' },
    { id: 10, name: 'Rodaballo', quantity: 50, price: 20.00, expirationDate: '2024-12-31' },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof Product>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter()

  const handleSort = (column: keyof Product) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
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

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = Math.max(...products.map(p => p.id), 0) + 1
    setProducts([...products, { ...newProduct, id }])
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (updatedProduct: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...updatedProduct, id: editingProduct.id } : p));
    }
    setIsEditDialogOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const isNearExpiration = (expirationDate: string) => {
    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 5 && diffDays > 0
  }

  const isExpired = (expirationDate: string) => {
    const today = new Date()
    const expDate = new Date(expirationDate)
    return expDate < today
  }

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
        <Button onClick={() => router.push('/reporte-mensual')}>Ver Reporte Mensual</Button>
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
            <TableHead onClick={() => handleSort('expirationDate')} className="cursor-pointer">
              Fecha de Vencimiento <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id} className={
              isExpired(product.expirationDate) ? 'bg-red-100' :
              isNearExpiration(product.expirationDate) ? 'bg-yellow-100' : ''
            }>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${Number(product.price).toFixed(2)}</TableCell>
              <TableCell className="flex items-center">
                {product.expirationDate}
                {isNearExpiration(product.expirationDate) && (
                  <AlertTriangle className="h-4 w-4 ml-2 text-yellow-500" />
                )}
                {isExpired(product.expirationDate) && (
                  <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />
                )}
              </TableCell>
              <TableCell>
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
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
}

function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(
    initialData || {
      name: '',
      quantity: 0,
      price: 0,
      expirationDate: '',
      description: '',
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

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
        <Input id="expirationDate" name="expirationDate" type="date" value={formData.expirationDate} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <Button type="submit">Guardar</Button>
    </form>
  )
}