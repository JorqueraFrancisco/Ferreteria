import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CalculosService } from 'src/app/services/calculos.service';


@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.css']
})
export class MetasComponent  {
  //Graficos
  graficoNumeroDocumentos: any[]
  graficoMontoTotalVentas : any[]
  graficoEfectividad : any[]
  graficoServicio : any[]
  graficoEficiencia : any[]
  graficoCumplimiento : any[]
  //Datos meta
  numDocMeta: number
  montoVentasMeta: number 
  efectividadMeta : number
  servicioMeta: number
  eficienciaMeta: number
  cumplimientoMeta: number
  //Datos estadisticos
  numDocEst: number
  montoVentasEst: number 
  efectividadEst : number
  servicioEst: number
  eficienciaEst: number
  cumplimientoEst: number
  //Periodo Actual
  periodo: string = this.extraerPeriodo(new Date)

    //Graficos

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = false;
  yAxisLabel1: string = 'Total venta';
  yAxisLabel2: string = 'Efectividad';
  yAxisLabel3: string = 'Servicio';
  yAxisLabel4: string = 'Eficiencia';
  yAxisLabel5: string = 'Cumplimiento';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';
  view: any[] = [700, 400];
  colorScheme = {domain: ['#b7b7a4', '#48bfe3', '#C7B42C', '#AAAAAA']};




  constructor(private firebase: FirebaseService,private calculos: CalculosService) {
    this.cargarGraficos()
  }




  cargarGraficos(){
    this.firebase.isAuth().subscribe(dataUsuario => {
      this.firebase.obtenerDatosUsuario( dataUsuario.uid ).subscribe(
        dataUid => {
          this.firebase.obtenerMetasUsuario( dataUid.data()['usuario'] , this.periodo ).subscribe(
            data => {
              this.numDocMeta = data[0]['metaNumeroDocumentos']
              this.montoVentasMeta = data[0]['metaMontoTotalVentas']
              this.efectividadMeta = data[0]['metaEfectividad']
              this.servicioMeta = data[0]['metaServicio']
              this.eficienciaMeta = data[0]['metaEficiencia']
              this.cumplimientoMeta = data[0]['metaCumplimiento']
            }
          )
          this.firebase.obtenerEstadisticasUsuario(dataUid.data()['usuario'], this.periodo).subscribe(
            data =>{             
              data.forEach(
                doc =>{
                  this.numDocEst = doc.data()['numeroDocumentos']
                  this.montoVentasEst = doc.data()['montoTotalDeVentas']
                  this.efectividadEst = doc.data()['efectividad']
                  this.servicioEst = doc.data()['servicio']
                  this.eficienciaEst = doc.data()['eficiencia']
                  this.cumplimientoEst =  this.calculos.calcularCumplimiento(doc.data()['montoTotalDeVentas'],this.montoVentasMeta)
                }
              )
            
              this.graficoNumeroDocumentos = [{"name": "Meta","value": this.numDocMeta}, {"name": "Alcanzado","value": this.numDocEst}];
              this.graficoMontoTotalVentas = [{"name": "Meta","value": this.montoVentasMeta},{"name": "Alcanzado","value": this.montoVentasEst}];
              this.graficoEfectividad = [{"name": "Meta","value": this.efectividadMeta},{"name": "Alcanzado","value": this.efectividadEst}];
              this.graficoServicio = [{"name": "Meta","value": this.servicioMeta},{"name": "Alcanzado","value": this.servicioEst}];
              this.graficoEficiencia = [{"name": "Meta","value": this.eficienciaMeta},{"name": "Alcanzado","value": this.eficienciaEst}];
              this.graficoCumplimiento = [{"name": "Meta","value": this.cumplimientoMeta},{"name": "Alcanzado","value": this.cumplimientoEst}];
              console.log(this.numDocMeta)
            }
          )
        }
      )
   
    })
   //this.firebase.obtenerMetasUsuario( , this.periodo )
  }




   //Extraccion de periodo 
   
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
