"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FormularioReserva from "@/components/formulario-reserva"
import ListaTurnos from "@/components/lista-turnos"
import { Scissors, Calendar, Lock } from "lucide-react"

export default function Home() {
  const [mostrarAdmin, setMostrarAdmin] = useState(false)
  const [claveAdmin, setClaveAdmin] = useState("")

  // Clave simple para acceder al panel de administración
  const CLAVE_BARBERO = "barbero123"

  const verificarClave = () => {
    if (claveAdmin === CLAVE_BARBERO) {
      setMostrarAdmin(true)
    } else {
      alert("Clave incorrecta")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Scissors className="h-10 w-10 text-blue-600" />
            Barbería Moderna
          </h1>
          <p className="text-gray-600 text-lg">Sistema de reserva de turnos online</p>
        </div>

        <Tabs defaultValue="reservar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="reservar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Reservar Turno
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Panel Barbero
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservar" className="space-y-6">
            <FormularioReserva />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            {!mostrarAdmin ? (
              <div className="max-w-md mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Acceso Restringido
                  </h3>
                  <p className="text-gray-600 mb-4">Ingresa la clave para acceder al panel de administración:</p>
                  <div className="space-y-4">
                    <input
                      type="password"
                      value={claveAdmin}
                      onChange={(e) => setClaveAdmin(e.target.value)}
                      placeholder="Clave de barbero"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === "Enter" && verificarClave()}
                    />
                    <Button onClick={verificarClave} className="w-full">
                      Acceder
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Pista: la clave es "barbero123"</p>
                </div>
              </div>
            ) : (
              <ListaTurnos />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
