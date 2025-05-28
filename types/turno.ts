export interface Turno {
  id?: string
  nombre: string
  telefono: string
  fecha: string
  hora: string
  servicio: string
  fechaCreacion: Date
}

export interface TurnoFormData {
  nombre: string
  telefono: string
  fecha: string
  hora: string
  servicio: string
}
