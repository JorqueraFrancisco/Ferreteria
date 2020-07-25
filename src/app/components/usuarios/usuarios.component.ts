import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios:any [] = []

  constructor(private firebase: FirebaseService, private router: Router) { 

    this.firebase.obtenerUsuarios().subscribe(data => data.forEach(
       doc => {
         if (doc['tipo'] == 'vendedor') {
          this.usuarios.push(doc)
         }        
        }
      )
    )

  }



  ngOnInit() {
  }

  metas(usuario : string){
    this.router.navigate ([ '/ingresarMetas', usuario ])
  }



}
