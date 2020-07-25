import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavbarService } from 'src/app/services/navbar.service'; 
import {Location} from '@angular/common';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  logueado: boolean = false

  constructor( private firebase:FirebaseService, public nav:NavbarService, private location: Location) {}

  ngOnInit() {
  }


  volver(){
    this.location.back();
  }
  logout(){
    this.firebase.desloguearse()
    window.location.reload();
}

}
