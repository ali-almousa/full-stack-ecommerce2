import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  // base urls
  private countriesUrl = environment.luv2shopApiUrl + "/countries";
  private statesUrl = environment.luv2shopApiUrl + "/states";

  // inject the HttpClient
  constructor(private httpClient: HttpClient) { }

  // get countries from the backend
  // return an observable and maps the JSON data from spring data rest to Country array
  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  // get countries from the backend
  // return an observable and maps the JSON data from spring data rest to State array
  getStates(theCountryCode: string): Observable<State[]> {

    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  // ? why should it be an Observable array? why not a normal array?
  // angular component will subscribe to this given method to retrieve async data
  getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data: number[] = [];

    // build an array for "Month" dropdown list 
    // start at desired startMonth and loop until 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    // the "of" operator from rxis, will wrap an object as an observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // build an array for "year" dropdown list
    // - start at current year and loop for next 10 years
    // get the current year (2022)
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}

// used to unwrap the JSON data from spring data rest _embedded entry
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

// used to unwrap the JSON data from spring data rest _embedded entry
interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}