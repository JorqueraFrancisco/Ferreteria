import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-ingresar-metas',
  templateUrl: './ingresar-metas.component.html',
  styleUrls: ['./ingresar-metas.component.css']
})
export class IngresarMetasComponent implements OnInit {

   numeroDeDocumentos : number 
   montoTotalDeVentas: number
   efectividad: number
   servicio: number
   eficiencia: number
   cumplimiento: number
   usuario:string
   fechaActual = this.extraerPeriodo(new Date)
   metas:any [] = []

  constructor(private firebase: FirebaseService, private activatedRoute: ActivatedRoute) { 
    //obtiene el id de usuario por parametro
    this.activatedRoute.params.subscribe(params=> {     
      this.usuario = params['id'] 
      this.firebase.existeMetaUsuario( this.usuario , this.extraerPeriodo(new Date)).subscribe(((data: any[]) => {
        if (data.length <= 0) {
          this.firebase.inicializarMetaUsuario(this.usuario, this.fechaActual)
        }else{          
          this.obtenerDatosMetas();
        } 

      }))
      
      })

  }

  ngOnInit(): void {
  }

  obtenerDatosMetas(){
     
  //se obtiene las metas del usuario en la base se datos 
    // this.firebase.obtenerUsuario(this.usuario).then(
    //   data => data.forEach((doc) => { 
    //     this.firebase.obtenerMetasUsuario(this.usuario).subscribe(data => {
    //       this.numeroDeDocumentos = data['Numero de documentos']
    //       this.montoTotalDeVentas =data['Monto total de ventas']
    //       this.efectividad =data['Efectividad meta']
    //       this.servicio =data['Servicio meta']
    //       this. eficiencia =data['Eficiencia meta']
    //       this. cumplimiento =data['Cumplimiento meta']     
          
    //      })
    //   })) 

    // this.firebase.obtenerUsuario(this.usuario).then(
    //   data => data.forEach((doc) => { 
    //      this.firebase.obtenerMetasUsuario(this.usuario)}))
   
     this.firebase.obtenerMetasUsuario(this.usuario , this.fechaActual).subscribe( (data: any[]) =>{ 
          this.numeroDeDocumentos = data[0]['metaNumeroDocumentos']
          this.montoTotalDeVentas =data[0]['metaMontoTotalVentas']
          this.efectividad =data[0]['metaEfectividad']
          this.servicio =data[0]['metaServicio']
          this. eficiencia =data[0]['metaEficiencia']
          this. cumplimiento =data[0]['metaCumplimiento']   
      }

     );
  }
  cambiarNumeroDeDocumentos( numero: number ){

    if (numero == null || numero == undefined || numero == 0 || numero < 0) {return} 

    this.firebase.obtenerUsuario(this.usuario).then(
    data => data.forEach((doc) => { this.firebase.cambiarMeta('numeroDocumento', numero, this.usuario, this.fechaActual )})); 

  }

 
  cambiarTotalDeVentas ( numero : number ){

    if (numero == null || numero == undefined || numero == 0 || numero < 0) {return} 

    this.firebase.obtenerUsuario(this.usuario).then(
    data => data.forEach((doc) => { this.firebase.cambiarMeta('montoTotal', numero , this.usuario , this.fechaActual)})); 

  }
  cambiarEfectividad ( numero : number ){

    if (numero == null || numero == undefined || numero == 0 || numero < 0) {return} 

    this.firebase.obtenerUsuario(this.usuario).then(
    data => data.forEach((doc) => { this.firebase.cambiarMeta('efectividad', numero,this.usuario, this.fechaActual )})); 
  }
  cambiarServicio ( numero : number ){

    if (numero == null || numero == undefined || numero == 0 || numero < 0) {return} 

    this.firebase.obtenerUsuario(this.usuario).then(
    data => data.forEach((doc) => { this.firebase.cambiarMeta('servicio', numero, this.usuario , this.fechaActual )})); 
  }
  cambiarEficiencia ( numero : number ){

    if (numero == null || numero == undefined || numero == 0 || numero < 0) {return} 

    this.firebase.obtenerUsuario(this.usuario).then(
    data => data.forEach((doc) => { this.firebase.cambiarMeta('eficiencia', numero, this.usuario , this.fechaActual )})); 
  }
  cambiarCumplimiento( numero : number ){

    if (numero == null || numero == undefined || numero == 0 || numero < 0) {return} 

    this.firebase.obtenerUsuario(this.usuario).then(
    data => data.forEach((doc) => { this.firebase.cambiarMeta('cumplimiento', numero, this.usuario, this.fechaActual )})); 
  }

  formatoFecha(fecha: Date){
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts( fecha ) 
    return  day + '/' + month + '/' + year
  }
  
  extraerPeriodo(fecha: Date){
   let splitFecha = this.formatoFecha(fecha).split('/')
   return splitFecha[1] + '/' + splitFecha[2]
  }
  
}
