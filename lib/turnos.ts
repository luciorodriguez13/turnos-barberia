import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { Turno, TurnoFormData } from "@/types/turno"

export async function crearTurno(
  turnoData: TurnoFormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    // Verificar si ya existe un turno en esa fecha y hora
    const turnosRef = collection(db, "turnos")
    const q = query(turnosRef, where("fecha", "==", turnoData.fecha), where("hora", "==", turnoData.hora))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: "Ya existe un turno reservado para esa fecha y hora. Por favor, elige otro horario.",
      }
    }

    // Crear el nuevo turno
    const nuevoTurno = {
      ...turnoData,
      fechaCreacion: Timestamp.now(),
    }

    const docRef = await addDoc(turnosRef, nuevoTurno)

    return {
      success: true,
      message: "Turno reservado exitosamente",
      id: docRef.id,
    }
  } catch (error) {
    console.error("Error al crear turno:", error)
    return {
      success: false,
      message: "Error al reservar el turno. Inténtalo nuevamente.",
    }
  }
}

export async function obtenerTurnos(): Promise<Turno[]> {
  try {
    const turnosRef = collection(db, "turnos")
    const q = query(turnosRef, orderBy("fecha", "asc"), orderBy("hora", "asc"))
    const querySnapshot = await getDocs(q)

    const turnos: Turno[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      turnos.push({
        id: doc.id,
        nombre: data.nombre,
        telefono: data.telefono,
        fecha: data.fecha,
        hora: data.hora,
        servicio: data.servicio,
        fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
      })
    })

    return turnos
  } catch (error) {
    console.error("Error al obtener turnos:", error)
    return []
  }
}
