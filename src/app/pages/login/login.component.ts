import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { NavbarService } from 'src/app/services/navbar.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario :UsuarioModel = new UsuarioModel()
  recordar = false;

  constructor(private firebase:FirebaseService,  private router:Router, public nav: NavbarService) {
 
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordar = true;
    }
    this.firebase.desloguearse()
   }

  ngOnInit() {
    this.nav.hide()
  }

  
  onLogin( form: NgForm ){

    if (form.invalid) {return} 

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    })

    Swal.showLoading();
    this.firebase.loginEmailUser(this.usuario).then((res) => {
          
            if ( this.recordar ) {
              localStorage.setItem('email',this.usuario.email)
            }

            this.firebase.isAuth().subscribe(data => 
              this.firebase.tipoUsuario(data.uid).then((doc) => {
                console.log(data.uid)
                console.log(doc.data().tipo)
               this.onLoginRedirect(doc.data().tipo)
              })
            
            )
            
      }).catch(error => 

            Swal.fire({
              icon: 'error',
              title: 'Error al auntenticar',
              text: error.message
        })
        )


  }

  onLoginRedirect(tipo:string) {
    this.nav.show()
    if (tipo == 'administrativo') {
      this.router.navigate(['/homeAdmin']);
    }else if (tipo == 'vendedor'){ 
      this.router.navigate(['/metas']);
    }

    Swal.close();

  }
}


// login ( form: NgForm ){

    
//   if (form.invalid) {return} 
//   //Alerta
//   Swal.fire({
//     allowOutsideClick: false,
//     icon: 'info',
//     text:'Espere por favor...'
//   })
//   Swal.showLoading();

//   this.firebase.login(this.usuario).then( () =>{
    
//     Swal.close();

//     if (this.recordar) {
//       localStorage.setItem('email',this.usuario.email)
//     }
//     this.onLoginRedirect()
//   })
//   .catch(function(error) {
//     //Alerta
//     Swal.fire({
//       icon: 'error',
//       title: 'Error al auntenticar',
//       text: error.message
//     })
//     console.log(error.message);  
//   })



// }
