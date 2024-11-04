'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ProductSale {
  name: string
  quantity: number
  revenue: number
}

const monthlyData: ProductSale[] = [
  { name: "Salmón", quantity: 500, revenue: 7500 },
  { name: "Atún", quantity: 450, revenue: 5850 },
  { name: "Bacalao", quantity: 300, revenue: 3300 },
  { name: "Trucha", quantity: 250, revenue: 3125 },
  { name: "Merluza", quantity: 200, revenue: 2000 },
  { name: "Sardinas", quantity: 150, revenue: 900 },
  { name: "Lenguado", quantity: 100, revenue: 2000 },
  { name: "Dorada", quantity: 80, revenue: 1200 },
  { name: "Lubina", quantity: 75, revenue: 1125 },
  { name: "Rodaballo", quantity: 50, revenue: 1000 },
]

export default function ReporteMensual() {
  const [showAllProducts, setShowAllProducts] = useState(false)

  const sortedData = [...monthlyData].sort((a, b) => b.quantity - a.quantity)
  const topProducts = sortedData.slice(0, 5)
  const bottomProducts = sortedData.slice(-5).reverse()

  const chartData = topProducts.map(product => ({
    name: product.name,
    Ventas: product.quantity,
    Ingresos: product.revenue
  }))

  const totalRevenue = monthlyData.reduce((sum, product) => sum + product.revenue, 0)
  const totalQuantity = monthlyData.reduce((sum, product) => sum + product.quantity, 0)

  const getRecommendation = (product: ProductSale) => {
    const averageQuantity = totalQuantity / monthlyData.length
    if (product.quantity > averageQuantity * 1.2) {
      return "Aumentar stock"
    } else if (product.quantity < averageQuantity * 0.8) {
      return "Reducir stock"
    } else {
      return "Mantener stock"
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte Mensual de Ventas</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Ventas</CardTitle>
            <CardDescription>Cantidad total de productos vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalQuantity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Totales</CardTitle>
            <CardDescription>Ingresos generados este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Producto Más Vendido</CardTitle>
            <CardDescription>El producto con mayor cantidad de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{topProducts[0].name}</p>
            <p className="text-sm text-muted-foreground">Cantidad: {topProducts[0].quantity}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Gráfico de Ventas Top 5</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="Ventas" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="Ingresos" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Resumen de Productos</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad Vendida</TableHead>
              <TableHead>Ingresos</TableHead>
              <TableHead>Recomendación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(showAllProducts ? sortedData : [...topProducts, ...bottomProducts]).map((product) => (
              <TableRow key={product.name}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>${product.revenue.toFixed(2)}</TableCell>
                <TableCell>{getRecommendation(product)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={() => setShowAllProducts(!showAllProducts)} className="mt-4">
          {showAllProducts ? "Mostrar resumen" : "Mostrar todos los productos"}
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recomendaciones para el Próximo Mes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Aumentar el stock de {topProducts[0].name} y {topProducts[1].name} para satisfacer la alta demanda.</li>
          <li>Considerar promociones especiales para {bottomProducts[0].name} y {bottomProducts[1].name} para impulsar las ventas.</li>
          <li>Mantener un stock equilibrado de los productos de rango medio.</li>
          <li>Evaluar la posibilidad de introducir nuevas variedades de los productos más vendidos.</li>
        </ul>
      </div>
    </div>
  )
}