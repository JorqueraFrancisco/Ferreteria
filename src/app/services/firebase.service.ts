import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { DatosModel } from '../models/datos.model';
import { error } from '@angular/compiler/src/util';
import { EstadisticaModel } from '../models/estadistica.model';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  userData: any;

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // para poder implementar el tanto login como el registro en firebase
  // ver el video de subir imagenes del curso de angular de Udemy 
  // import  * as firebase from "firebase"; en el servicio
  // import { AngularFireModule } from '@angular/fire'; en module.ts
  // import { AngularFireAnalyticsModule } from '@angular/fire/analytics';  en module.ts
  // import { environment } from '../environments/environment'; en module.ts
  // imports: [
  //  AngularFireModule.initializeApp(environment.firebase),
  //  AngularFireAnalyticsModule
  //  ] en el module.ts


  registerUser( usuario :UsuarioModel ) {
    return new Promise((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.password)
        .then(userData => {
          
          usuario.id = userData.user.uid 

          this.firestore.collection('usuarios').doc(userData.user.uid).set({
              nombre: usuario.nombre,
              email: usuario.email,
              usuario: usuario.usuario,  
              tipo: usuario.tipo,     
            })

          resolve( userData )})
          .catch(err => console.log(reject(err)))
    });
  }

  loginEmailUser( usuario :UsuarioModel ) {

    return new Promise((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(usuario.email, usuario.password)
        .then(userData => resolve(userData),
          err => reject(err));
    });

  }


  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  // termina la sesion de usuario
  desloguearse() {
    return this.afAuth.signOut();
  }

 // retorna el tipo de usuario desde la base de datos
  tipoUsuario( uid :string ) {
    return  this.firestore.collection("usuarios").doc(uid).ref.get()
  }

  onStateChanged(){
     return this.afAuth
  }

  registrarVentas( documentos: unknown[] ) {

     let batch = this.firestore.firestore.batch()
    
    for (let index = 1; index < documentos.length; index++) {
      
      const id = this.firestore.createId();
      let nycRef = this.firestore.collection('datos de random').doc(id);
      batch.set( nycRef.ref ,{
          'usuario': documentos[index]['__EMPTY_1'],
          'nombre vendedor': documentos[index]['__EMPTY_2'],
          'codigo compra producto mts': documentos[index]['__EMPTY_3'],  
          'codigo producto random': documentos[index]['__EMPTY_4'],  
          'tipo de doc': documentos[index]['__EMPTY_5'],  
          'numero de doc': documentos[index]['__EMPTY_6'],
          'idmaeedo': documentos[index]['__EMPTY_7'],
          'modalidad de venta': documentos[index]['__EMPTY_8'],
          'cantidad comprada (1)': documentos[index]['__EMPTY_9'],
          'cantidad comprada (2)': documentos[index]['__EMPTY_10'],
          'monto': documentos[index]['__EMPTY_11'],
          'cliente': documentos[index]['__EMPTY_12'],
          'nosudo': documentos[index]['__EMPTY_13'],
          'descripcion del producto': documentos[index]['__EMPTY_14']
  
        });

        //--------------------------------------------------------------------
     
      // this.firestore.collection('datos de random').doc(documentos[index]['__EMPTY_1']).set({
      //   'nombre vendedor': documentos[index]['__EMPTY_2'],
      //   'codigo compra producto mts': documentos[index]['__EMPTY_3'],  
      //   'codigo producto random': documentos[index]['__EMPTY_4'],  
      //   'tipo de doc': documentos[index]['__EMPTY_5'],  
      //   'numero de doc': documentos[index]['__EMPTY_6'],
      //   'idmaeedo': documentos[index]['__EMPTY_7'],
      //   'modalidad de venta': documentos[index]['__EMPTY_8'],
      //   'cantidad comprada (1)': documentos[index]['__EMPTY_9'],
      //   'cantidad comprada (2)': documentos[index]['__EMPTY_10'],
      //   'monto': documentos[index]['__EMPTY_11'],
      //   'cliente': documentos[index]['__EMPTY_12'],
      //   'nosudo': documentos[index]['__EMPTY_13'],
      //   'descripcion del producto': documentos[index]['__EMPTY_14']

      // })
      
      
    }
     return batch.commit()
 }

  obtenerUsuarios(){
   return  this.firestore.collection("usuarios").valueChanges()   
  }
  
  existeMetaUsuario(usuario :string, periodo : string){
    return this.firestore.collection('metas', ref => ref.where("usuario", "==", usuario).where("periodo", "==", periodo)).valueChanges()
  }

  inicializarMetaUsuario(usuario :string, fecha :string){
      this.firestore.collection('metas').add({ 
      'usuario': usuario,
      'periodo': fecha,
      'metaNumeroDocumentos': 0,
      'metaMontoTotalVentas': 0,
      'metaEfectividad': 0,
      'metaServicio': 0,
      'metaEficiencia': 0,
      'metaCumplimiento': 0,


  })
  }

  obtenerDatosUsuario(uid: string){
   return this.firestore.collection('usuarios').doc(uid).get()
  }
  obtenerUsuario(usuario:string){
   return this.firestore.collection("usuarios").ref.where("usuario", "==", usuario).get()
      // return this.firestore.collection("usuarios").doc().snapshotChanges().pipe(
      // map(data => {return data.payload.data()}))
    }

  obtenerMetasUsuario( usuario :string , fecha :string ){

   return this.firestore.collection("metas", ref => ref.where("usuario", "==", usuario).where("periodo", "==", fecha))
   .valueChanges()
  
  }
  obtenerMetasUsuarios ( periodo: string ){
   return this.firestore.collection('metas').valueChanges()
  }
    
  cambiarMeta( tipoMeta : string, valor: number, uid:string ,fecha: string){

    if (tipoMeta == 'numeroDocumento') {
 
      this.firestore.collection('metas').ref.where("periodo", "==", fecha).where("usuario", "==",uid ).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              'metaNumeroDocumentos': valor
            }) 
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);

      });
 
    }
    if (tipoMeta == 'montoTotal') {
      
      this.firestore.collection('metas').ref.where("periodo", "==", fecha).where("usuario", "==",uid ).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({    
              'metaMontoTotalVentas': valor
            }) 
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

    }
    if (tipoMeta == 'efectividad') {

      this.firestore.collection('metas').ref.where("periodo", "==", fecha).where("usuario", "==",uid ).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              'metaEfectividad': valor
            }) 
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    
    }
    if (tipoMeta == 'servicio') {

      this.firestore.collection('metas').ref.where("periodo", "==", fecha).where("usuario", "==",uid ).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              'metaServicio': valor
            }) 
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

    }
    if (tipoMeta == 'eficiencia') {
      this.firestore.collection('metas').ref.where("periodo", "==", fecha).where("usuario", "==",uid ).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              'metaEficiencia': valor
            }) 
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

    }
    if (tipoMeta == 'cumplimiento') {

      this.firestore.collection('metas').ref.where("periodo", "==", fecha).where("usuario", "==",uid ).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              'metaCumplimiento': valor
            }) 
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

    }
      
 }

guardarEstadisticaUsuariosSumados(estadistica : EstadisticaModel []){

  estadistica.forEach(element => {
    this.firestore.collection('estadisticas').ref.where("usuario", "==", element.usuario).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
         'numeroDocumentos' : element.numeroDocumentos,
         'montoTotalDeVentas': element.montoTotalDeVentas,
         'efectividad': element.efectividad,
         'eficiencia': element.eficiencia,
         'servicio': element.servicio,
         'periodo': element.periodo,
         'usuario': element.usuario
        }) 
      });
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });

  });

}

guardarEstadisticaUsuariosNuevos(estadistica : EstadisticaModel []){

  estadistica.forEach(element => {
    const id = this.firestore.createId();
    this.firestore.collection('estadisticas').doc(id).set({
         
         'numeroDocumentos' : element.numeroDocumentos,
         'montoTotalDeVentas': element.montoTotalDeVentas,
         'efectividad': element.efectividad,
         'eficiencia': element.eficiencia,
         'servicio': element.servicio,
         'periodo': element.periodo,
         'usuario': element.usuario
 
       })
  });
 
}

actualizarEstadisticaUsuario( usuario : string , periodo :string, EstadisticaUsuario :EstadisticaModel){

  this.firestore.collection('estadisticas').ref.where("periodo", "==", periodo).where("usuario", "==",usuario).get() .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.update({
        'numeroDocumentos' : EstadisticaUsuario.numeroDocumentos,
        'montoTotalDeVentas': EstadisticaUsuario.montoTotalDeVentas,
        'efectividad': EstadisticaUsuario.efectividad,
        'eficiencia': EstadisticaUsuario.eficiencia,
        'servicio': EstadisticaUsuario.servicio,
        'periodo': EstadisticaUsuario.periodo,
        'usuario': EstadisticaUsuario.usuario
      }) 
    });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
         
   


}

obtenerEstadisticasUsuarios(periodo ?: string){
  console.log(periodo)
if (periodo) {
  return this.firestore.collection("estadisticas", ref => ref.where("periodo", "==", periodo)).get()
}else{
  return this.firestore.collection("estadisticas").get()
}
 
}

obtenerEstadisticasUsuario(usuario: string , periodo : string){
  return this.firestore.collection("estadisticas", ref => ref.where("periodo", "==", periodo).where("usuario","==",usuario)).get()
}

}

// this.db.collection('Publicaciones').snapshotChanges().pipe(
//   map(action  => action.map( a=>{
//    return a.payload.doc.data();
//   }))