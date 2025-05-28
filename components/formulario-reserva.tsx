"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { crearTurno } from "@/lib/turnos"
import type { TurnoFormData } from "@/types/turno"
import { Calendar, Clock, User, Phone, Scissors } from "lucide-react"

export default function FormularioReserva() {
  const [formData, setFormData] = useState<TurnoFormData>({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    servicio: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null)

  const servicios = ["Corte de cabello", "Barba", "Corte + Barba", "Afeitado clásico", "Arreglo de cejas", "Otro"]

  const horarios = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMensaje(null)

    try {
      const resultado = await crearTurno(formData)

      if (resultado.success) {
        setMensaje({ tipo: "success", texto: resultado.message })
        setFormData({
          nombre: "",
          telefono: "",
          fecha: "",
          hora: "",
          servicio: "",
        })
      } else {
        setMensaje({ tipo: "error", texto: resultado.message })
      }
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error inesperado. Inténtalo nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof TurnoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scissors className="h-6 w-6" />
          Reservar Turno
        </CardTitle>
        <CardDescription>Completa el formulario para reservar tu turno</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre completo
            </Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Teléfono
            </Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleInputChange("telefono", e.target.value)}
              placeholder="Tu número de teléfono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha
            </Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              min={today}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hora
            </Label>
            <Select value={formData.hora} onValueChange={(value) => handleInputChange("hora", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una hora" />
              </SelectTrigger>
              <SelectContent>
                {horarios.map((hora) => (
                  <SelectItem key={hora} value={hora}>
                    {hora}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servicio" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Servicio (opcional)
            </Label>
            <Select value={formData.servicio} onValueChange={(value) => handleInputChange("servicio", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {servicios.map((servicio) => (
                  <SelectItem key={servicio} value={servicio}>
                    {servicio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mensaje && (
            <Alert className={mensaje.tipo === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              <AlertDescription className={mensaje.tipo === "success" ? "text-green-700" : "text-red-700"}>
                {mensaje.texto}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.nombre || !formData.telefono || !formData.fecha || !formData.hora}
          >
            {isLoading ? "Reservando..." : "Reservar Turno"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
