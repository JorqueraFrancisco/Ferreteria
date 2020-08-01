import { Component } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CalculosService } from 'src/app/services/calculos.service';
import { EstadisticaModel } from '../../../models/estadistica.model';
import Swal from 'sweetalert2';
import html2canvas from "html2canvas";
import * as jspdf from "jspdf";

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  EstadisticaUsuarioPeriodoActual: any[] = []
  estadisticaUsuario: EstadisticaModel = new EstadisticaModel()
  montoTotalVentasPeriodoActual: number = 0
  vendedoresMetas: any[] = []
  vendedoresEstadistica: any[] = []

  //Propiedades grafico
  lineChartData: ChartDataSets[] = [{ data: [20000000, 40000000, 10000000, 2000000, 10000000, 50000000, 0, 0, 0, 0, 0,0], label: 'Ventas totales' }]
  lineChartLabels: Label[] = ['En', 'Feb', 'Abr', 'May', 'Jun', 'Jul', 'Julio', 'Agt', 'Sept', 'Oct', 'Nov', 'Dic'];
  mostrarGrafico = false
  lineChartOptions: any = { responsive: true }
  lineChartColors: Color[] = [{ borderColor: 'black', backgroundColor: '#269400' }]
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [];
  html2canvas: any;


  constructor(private firebase: FirebaseService, private calculos: CalculosService) {

    Swal.showLoading();

    this.firebase.obtenerUsuarios().subscribe(data => {
      data.forEach(
        docUsuario => {
          this.firebase.obtenerMetasUsuarios(this.extraerPeriodo(new Date)).subscribe(
            data => {
              data.forEach(
                docMeta => {
                  console.log(docMeta)
                  if (docUsuario['tipo'] == 'vendedor') {
                    if (docUsuario['usuario'] == docMeta['usuario']) {

                      this.vendedoresMetas.push(Object.assign(docUsuario, docMeta))
                    }
                  }

                }
              )
            }
          )
        }
      )
      //poner aca el codigo de abajo
      this.obtenerDatosEstadisticas()
      //console.log(this.EstadisticaUsuarioPeriodoActual)
    }
    )

  }
  generarPdf() {
    var element = document.getElementById('tabla')
    html2canvas(element).then(canvas => {
      var imgData = canvas.toDataURL("ímg/png")
      var doc = new jspdf()
      var imgHeight = canvas.height * 208 / canvas.width
      doc.addImage(imgData, 0, 0, 208, imgHeight)
      doc.save('reporte.pdf')
    }

    )
  };


  obtenerDatosEstadisticas() {
    this.firebase.obtenerEstadisticasUsuarios(this.extraerPeriodo(new Date)).subscribe(data => {
      data.forEach(docEstadistica => {

        //console.log(docEstadistica.data()['usuario'],this.vendedoresMetas[count]['usuario'])
        // if (docEstadistica.data()['usuario'] == this.vendedoresMetas[count]['usuario']) {             
        // }

        this.vendedoresEstadistica.push(docEstadistica.data())
        this.montoTotalVentasPeriodoActual = this.montoTotalVentasPeriodoActual + docEstadistica.data()['montoTotalDeVentas']
      })

      //Se recorren y comparan los dos arreglos vendedoresMeta vs vendedoresEstadistica
      for (let index = 0; index < this.vendedoresMetas.length; index++) {

        this.vendedoresEstadistica.forEach(element => {
          if (this.vendedoresMetas[index]['usuario'] == element['usuario']) {
            this.EstadisticaUsuarioPeriodoActual.push(Object.assign(this.vendedoresMetas[index], element))
          }
        });
      }
      console.log(this.montoTotalVentasPeriodoActual)
      this.lineChartData[0]['data'][7] = this.montoTotalVentasPeriodoActual
      this.mostrarGrafico = true
      Swal.close()
    }
    )
  }

  //Extraccion de periodo 

  formatoFecha(fecha: Date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(fecha)
    return day + '/' + month + '/' + year
  }

  extraerPeriodo(fecha: Date) {
    let splitFecha = this.formatoFecha(fecha).split('/')
    return splitFecha[1] + '/' + splitFecha[2]
  }

}
