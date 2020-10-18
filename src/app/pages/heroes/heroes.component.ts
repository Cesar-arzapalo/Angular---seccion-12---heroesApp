import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeComponent } from '../heroe/heroe.component';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: HeroeModel[];
  cargando: boolean;
  constructor(private heroesService: HeroesService) { this.cargando = true; this.heroes = []; }

  ngOnInit(): void {
    this.heroesService.getHeroes().subscribe( resp => {
      this.heroes = resp;
      this.cargando = false;
    });
  }

  borrarHeroe(id: string){
    let heroe: string;
    this.heroes.map( (h: HeroeModel) => {
      if (h.id === id){
        heroe =  h.nombre;
      }
    });
    Swal.fire({
      title: 'Estas seguro',
      text: `Estas seguro de que deseea borrar al heroe ${heroe}`,
      showConfirmButton: true,
      showCancelButton: true
    }).then ( resp => {
      if (resp.value){
        this.heroesService.borrarHeroe(id).subscribe( () => this.heroes = this.heroes.filter( h => h.id !== id));
      }
    });



  }

}
