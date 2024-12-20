import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { map, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  private httpClient = inject(HttpClient)
  loadAvailablePlaces() {
    return this.fetchPlaces("http://localhost:3000/places", "Something went wrong fetching available places. Please try again later.")
  }

  loadUserPlaces() {
    return this.fetchPlaces("http://localhost:3000/user-places", "Something went wrong fetching your favorite places. Please try again later.")
   }

  addPlaceToUserPlaces(place: Place) {
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    })
  }

  removeUserPlace(place: Place) { }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((resData) => resData.places), catchError((error) => throwError(() => new Error(errorMessage)))
    )
  }
}
