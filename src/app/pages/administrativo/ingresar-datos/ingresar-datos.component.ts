import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DatosModel } from '../../../models/datos.model';
import { EstadisticaModel } from 'src/app/models/estadistica.model';
import { CalculosService } from 'src/app/services/calculos.service';

@Component({
  selector: 'app-ingresar-datos',
  templateUrl: './ingresar-datos.component.html',
  styleUrls: ['./ingresar-datos.component.css'],
  providers: [DatePipe]
})

export class IngresarDatosComponent {

  file:File
  arrayBuffer:any
  filelist:any
  datosUsuario:DatosModel = new DatosModel()
  estadisticaUsuario : EstadisticaModel = new EstadisticaModel()

  constructor(private firebase:FirebaseService, private calculos:CalculosService) { }
 
  addfile(event) { 

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Cargando los datos, espere...'
    })

    this.file= event.target.files[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(this.file);     
    fileReader.onload = (e) => {    
        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) {
          
          arr[i] = String.fromCharCode(data[i]); 
          
        }  
        var bstr = arr.join(""); 
        var workbook = XLSX.read(bstr, {type:"binary"});      
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];      
        var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
        this.filelist = [];    
        
        // this.firebase.registrarVentas(arraylist).then(function () {
          
        //   Swal.fire('Datos ingresados correctamente')
        // })
        // .catch(
        //     (err) => {console.log('Fail', err)
        //     Swal.fire(err)
        //   }
        // )

        //variables para calcular 
   
        let codigoBoletas :number [] = []
        let montoTotal :number = 0
        let cantidadItems :number = 0
        let diasTrabajado :string [] = []
        let ListaVentasUsuarios : DatosModel [] = []
        let listaEstadisticasUsuarios : EstadisticaModel[] = []
        let listaEstadisticasUsuariosSumados : EstadisticaModel[] = []
        let listaEstadisticasUsuariosNuevos : EstadisticaModel[] = []
        let usuarioActual = arraylist[1]['__EMPTY_1'];
        

      //recorrido del cada fila del excel
      for (let index = 1; index < arraylist.length; index++) {
      //realiza la ultima comparacion del ultimo elemento del array
       if ( index == arraylist.length - 1 ) {
          montoTotal = montoTotal + arraylist[index]['__EMPTY_11']  
          cantidadItems = cantidadItems + 1
          codigoBoletas.push(arraylist[index]['__EMPTY_6'])
          diasTrabajado.push(this.extraerFecha(arraylist[index]['__EMPTY_15']))

        }
       //Si cambia el usuario guarda los elementos guarda la estadistica y actualiza la variable usuario actual
       if ( arraylist[index]['__EMPTY_1'] != usuarioActual || index == arraylist.length - 1 ) {
          this.datosUsuario.usuario = usuarioActual
          this.datosUsuario.montoTotalDeVentas = montoTotal

          let cantidadDocumentos =codigoBoletas.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual).length
          this.datosUsuario.cantidadDocumentos = cantidadDocumentos
          let diasTrabajados =diasTrabajado.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual).length  
          this.datosUsuario.diasTrabajado =  diasTrabajados                                   
          this.datosUsuario.cantidadItems = cantidadItems  
          //se guarda el periodo de la fecha actual  de ingreso del excel
          this.datosUsuario.periodo = this.extraerPeriodo(new Date)                            
          let estadisticaPorUsuario = this.calcularEstadisticas(cantidadDocumentos,montoTotal,cantidadItems,diasTrabajados, usuarioActual, this.extraerPeriodo(new Date))
          listaEstadisticasUsuarios.push(estadisticaPorUsuario)
          ListaVentasUsuarios.push(this.datosUsuario)
          usuarioActual =  arraylist[index]['__EMPTY_1']
          //setear variables
          montoTotal = 0
          cantidadItems = 0
          codigoBoletas = []
          diasTrabajado = []
          this.estadisticaUsuario = new EstadisticaModel()
          this.datosUsuario = new DatosModel(); 

        }
      //Si el usuario actual es igual al usuario de la fila actual
      if ( usuarioActual == arraylist[index]['__EMPTY_1']  ) {
        cantidadItems = cantidadItems + 1
        montoTotal = montoTotal + arraylist[index]['__EMPTY_11']
        codigoBoletas.push(arraylist[index]['__EMPTY_6'])
        diasTrabajado.push(this.extraerFecha(arraylist[index]['__EMPTY_15']))
     
      }
      
     }

      //console.log(ListaVentasUsuarios)    
      //console.log(listaEstadisticasUsuarios)

     this.firebase.obtenerEstadisticasUsuarios(this.extraerPeriodo(new Date)).forEach(
       data => {

        //si no hay datos en la base de datos
        if (data.empty) {
          this.firebase.guardarEstadisticaUsuariosNuevos(listaEstadisticasUsuarios)
        }  
        for (const item of listaEstadisticasUsuarios) {
          let existe = false
          data.forEach(doc => {
              if ( item.usuario == doc.data()['usuario']) {
                existe = true
              }
          })
          if (existe == false) {
            this.estadisticaUsuario.numeroDocumentos = item.numeroDocumentos
            this.estadisticaUsuario.montoTotalDeVentas =  item.montoTotalDeVentas
            this.estadisticaUsuario.eficiencia =   item.eficiencia
            this.estadisticaUsuario.efectividad =  item.efectividad
            this.estadisticaUsuario.servicio =  item.servicio
            this.estadisticaUsuario.usuario = item.usuario
            this.estadisticaUsuario.periodo = item.periodo
            listaEstadisticasUsuariosNuevos.push(this.estadisticaUsuario)
            this.estadisticaUsuario = new EstadisticaModel()
          }

        }
       
        data.forEach(doc =>{
          
          for (const item of listaEstadisticasUsuarios) {        
            if (doc.data()['usuario'] == item.usuario) {
              this.estadisticaUsuario.numeroDocumentos = this.sumaEstadistica(doc.data()['numeroDocumentos'], item.numeroDocumentos)
              this.estadisticaUsuario.montoTotalDeVentas =   this. sumaEstadistica(doc.data()['montoTotalDeVentas'], item.montoTotalDeVentas)
              this.estadisticaUsuario.eficiencia =    this.sumaEstadistica(doc.data()['eficiencia'], item.eficiencia)
              this.estadisticaUsuario.efectividad =   this.sumaEstadistica(doc.data()['efectividad'], item.efectividad)
              this.estadisticaUsuario.servicio =    this.sumaEstadistica(doc.data()['servicio'],item.servicio )
              this.estadisticaUsuario.usuario = doc.data()['usuario'];   
              this.estadisticaUsuario.periodo = this.extraerPeriodo(new Date)     
              listaEstadisticasUsuariosSumados.push(this.estadisticaUsuario)
              //this.firebase.actualizarEstadisticaUsuario(doc['usuario'], this.extraerPeriodo(new Date) , this.estadisticaUsuario)
              this.estadisticaUsuario = new EstadisticaModel()
              
            } 
          }        
         })
            console.log('sumado: '+ listaEstadisticasUsuariosSumados.length,'nuevos: '+ listaEstadisticasUsuariosNuevos.length)
            console.log(listaEstadisticasUsuariosSumados)
            console.log(listaEstadisticasUsuariosNuevos)
            if (listaEstadisticasUsuariosSumados.length == 0) {
              return
            }else{
              this.firebase.guardarEstadisticaUsuariosSumados(listaEstadisticasUsuariosSumados)
            }
            if (listaEstadisticasUsuariosNuevos.length == 0) {
              return
            }else{
              this.firebase.guardarEstadisticaUsuariosNuevos(listaEstadisticasUsuariosNuevos)
            }
            listaEstadisticasUsuariosSumados = []
            listaEstadisticasUsuariosNuevos = []
            Swal.fire({
              icon: 'success',
              title:'Registro con exito'
            })
          }
        ) 
      }
  
  }    

  sumaEstadistica(valor1 : number, valor2:number){
    return valor1 + valor2
  }
  calcularEstadisticas(cantidadDocumentos: number, montoTotal : number,  cantidadItems : number, diasTrabajado: number, usuario:string , periodo : string) {
    this.estadisticaUsuario.numeroDocumentos = cantidadDocumentos
    this.estadisticaUsuario.montoTotalDeVentas = montoTotal
    this.estadisticaUsuario.efectividad = this.calculos.calcularEfectividad(cantidadDocumentos, diasTrabajado)
    this.estadisticaUsuario.servicio = this.calculos.calcularServicio(cantidadItems,cantidadDocumentos)
    this.estadisticaUsuario.eficiencia = this.calculos.calcularEficiencia(montoTotal,cantidadDocumentos)
    this.estadisticaUsuario.usuario = usuario
    this.estadisticaUsuario.periodo = periodo
    return this.estadisticaUsuario
  }

  extraerFecha(serial) {

    var utc_days = Math.floor(serial - 25568);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    var date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    return this. formatoFecha(date)
  
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

