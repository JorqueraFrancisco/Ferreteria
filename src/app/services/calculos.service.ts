import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor() { }

    calcularEfectividad(cantidadDocumentos : number, diasTrabajado: number){
      if (diasTrabajado == 0) {
        return 0
      }
      return cantidadDocumentos/diasTrabajado
    }
    calcularServicio(cantidadItems : number, cantidadDocumentos: number){
      if (cantidadDocumentos == 0) {
        return 0
      }
      
      return cantidadItems/cantidadDocumentos
    }
    calcularEficiencia(montoTotal : number, cantidadDocumentos: number){
      if (cantidadDocumentos == 0) {
        return 0
      }
      return montoTotal/cantidadDocumentos
    }
    calcularCumplimiento(montoTotal : number, meta: number){
      if (meta == 0) {
        return 0
      }
      return montoTotal/meta
    }


}
