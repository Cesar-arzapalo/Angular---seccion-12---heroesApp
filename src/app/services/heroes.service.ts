import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://heroesapp-81130.firebaseio.com';

  constructor(private http: HttpClient) { }

  crearHeroe(heroe: HeroeModel){
    return this.http.post(`${this.url}/heroes.json`, heroe)
      .pipe( map( (resp: any) => {
        console.log(resp);
        return resp.name;
      }));
  }

  actualizarHeroe(heroe: HeroeModel, id: string){
    return this.http.put(`${this.url}/heroes/${id}.json`, heroe);
  }

  getHeroe(id: string){
    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  getHeroes(){
    return this.http.get(`${this.url}/heroes.json`)
      .pipe(
        map( this.crearArrayHeroes)
      );
  }

  borrarHeroe(id: string){
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  private crearArrayHeroes(heroesObj: object) {
    const heroes: HeroeModel[] = [];

    console.log(heroesObj);

    if (heroesObj === null) { return []; }

    Object.keys(heroesObj).forEach( key => {
      const heroe: HeroeModel = heroesObj[key];
      heroe.id = key;
      heroes.push(heroe);
    });

    return heroes;
  }
}
