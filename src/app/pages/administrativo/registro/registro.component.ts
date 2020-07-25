import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario :UsuarioModel = new UsuarioModel();
  recordar = false;

  constructor(private firebase:FirebaseService) {}

  ngOnInit() {
   

  }

  onSubmit( form: NgForm ){

    if (form.invalid) {return}

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    })
    Swal.showLoading();

    this.firebase.registerUser(this.usuario)
    .then( () => {

      Swal.close();

      if (this.recordar) {
        localStorage.setItem('email',this.usuario.email)
      }
      Swal.fire({
        icon: 'success',
        title:'Registro con exito'
      })
    
     })
    .catch(function(error) {

      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: error.message
      })
      console.log(error.message);  
    
     });
    
  }
}
