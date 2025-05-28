"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { obtenerTurnos } from "@/lib/turnos"
import type { Turno } from "@/types/turno"
import { Calendar, Clock, User, Phone, Scissors, RefreshCw } from "lucide-react"

export default function ListaTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const cargarTurnos = async () => {
    setIsLoading(true)
    try {
      const turnosData = await obtenerTurnos()
      setTurnos(turnosData)
    } catch (error) {
      console.error("Error al cargar turnos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    cargarTurnos()
  }, [])

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha + "T00:00:00")
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const esTurnoHoy = (fecha: string) => {
    const today = new Date().toISOString().split("T")[0]
    return fecha === today
  }

  const esTurnoPasado = (fecha: string, hora: string) => {
    const now = new Date()
    const turnoDate = new Date(fecha + "T" + hora)
    return turnoDate < now
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Cargando turnos...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Turnos Reservados
            </CardTitle>
            <CardDescription>Panel de administración - Solo visible para el barbero</CardDescription>
          </div>
          <Button onClick={cargarTurnos} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {turnos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No hay turnos reservados</div>
        ) : (
          <div className="space-y-4">
            {turnos.map((turno) => (
              <div
                key={turno.id}
                className={`p-4 border rounded-lg ${
                  esTurnoPasado(turno.fecha, turno.hora)
                    ? "bg-gray-50 border-gray-200"
                    : esTurnoHoy(turno.fecha)
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{turno.nombre}</span>
                      {esTurnoHoy(turno.fecha) && <Badge variant="default">Hoy</Badge>}
                      {esTurnoPasado(turno.fecha, turno.hora) && <Badge variant="secondary">Pasado</Badge>}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {turno.telefono}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatearFecha(turno.fecha)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {turno.hora}
                      </div>
                    </div>

                    {turno.servicio && (
                      <div className="flex items-center gap-1 text-sm">
                        <Scissors className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{turno.servicio}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right text-xs text-gray-400">
                    Reservado: {turno.fechaCreacion.toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
