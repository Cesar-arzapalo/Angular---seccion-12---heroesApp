import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeroeModel } from 'src/app/models/heroe.model';
import { HeroesService } from '../../services/heroes.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {
  forms: FormGroup;
  btnVivo: string;
  btnMuerto: string;
  configuracion: string;
  constructor(private fb: FormBuilder, private router: Router, private heroeModel: HeroeModel,
              private heroesService: HeroesService, private routerActivate: ActivatedRoute) {
    // this.crearListener();
    this.btnVivo = 'btn-outline-success';
    this.btnMuerto = 'btn-outline-danger';
    // console.log(this.forms);
   }

  inicializarFormulario(){
    this.forms = this.fb.group({
      firebaseID: [{value: '', disabled: true}, Validators.required],
      nombre: ['', Validators.required],
      poder: ['', Validators.required],
      estado: [true, Validators.required]
    });
  }

  definicionFormulario(){
    this.forms.reset({
      nombre: '',
      firebaseID: '',
      poder: '',
      estado: null
    });
  }

  crearListener(){
    this.forms.valueChanges.subscribe((valor) => {
      console.log(valor);
    });

    this.forms.statusChanges.subscribe((status) => {
      console.log({status});
    });

  }
  estadoHeroe(estado: boolean){
    if (estado){
      this.btnVivo = 'btn-success';
      this.btnMuerto = 'btn-outline-danger';
    }else{
      this.btnVivo = 'btn-outline-success';
      this.btnMuerto = 'btn-danger';
    }
    this.forms.get('estado').setValue(estado);
  }

  valorNoValido(value: string){
    return this.forms.get(value).touched && this.forms.get(value).invalid;
  }

  agregarHeroe(){
    if (this.forms.invalid){
      this.forms.get('estado').markAsDirty();
      this.controlaMarkTouch(this.forms.controls);
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.heroeModel.nombre = this.forms.get('nombre').value;
    this.heroeModel.poder = this.forms.get('poder').value;
    this.heroeModel.vivo = this.forms.get('estado').value;


    let peticion: Observable<any>;

    if (this.forms.get('firebaseID').value === ''){
      peticion = this.heroesService.crearHeroe(this.heroeModel);
    } else{
      peticion = this.heroesService.actualizarHeroe(this.heroeModel, this.forms.get('firebaseID').value);
    }

    peticion.subscribe(resp => {
      Swal.fire({
        title: this.heroeModel.nombre,
        text: 'se actualizo completamente'
      });
      if (this.forms.get('firebaseID').value === ''){
        this.forms.get('firebaseID').setValue(resp);
      }
      this.configuracion = 'actualizar';
    });
  }

  controlaMarkTouch(fc: any){
    Object.values(fc).forEach( control => {
      if (control instanceof FormControl){
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.controlaMarkTouch(control.controls);
      }
    });
  }
  actualizarFormularioReactivo(id?: string, nombre?: string, poder?: string, vivo?: boolean){
    if (id != null){
      this.forms.get('firebaseID').setValue(id);
    }

    if (nombre != null){
      this.forms.get('nombre').setValue(nombre);
    }

    if (poder != null){
      this.forms.get('poder').setValue(poder);
    }

    if (vivo != null){
      this.forms.get('estado').setValue(vivo);
      this.estadoHeroe(vivo);
    }

  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.definicionFormulario();
    const id = this.routerActivate.snapshot.paramMap.get('id');
    if (id !== 'nuevo'){
      this.configuracion = 'actualizar';
      this.heroesService.getHeroe(id)
        .subscribe( (resp: HeroeModel) => {
          if (resp !== null){
            this.actualizarFormularioReactivo(id, resp.nombre, resp.poder, resp.vivo);
          }else{
            this.router.navigateByUrl('/heroes');
          }
        });
    }else{
      this.heroeModel.id = null;
      this.configuracion = 'añadir';
    }
  }

}
