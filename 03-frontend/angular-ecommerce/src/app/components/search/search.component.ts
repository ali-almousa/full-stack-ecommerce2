import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // inject the router to be able to navigate to other route
  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  // invoke this method when the search button is clicked
  // or the enter key is released
  doSearch(value: string){

    console.log(`value=${value}`);
    // append /search/value to the root origin (removing the additions)
    // route the data to our "search" route 
    // it will be handeled by the productListComponent
    this.route.navigateByUrl(`/search/${value}`);
  }

}
