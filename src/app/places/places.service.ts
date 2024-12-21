import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { map, catchError, throwError, tap } from 'rxjs';
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
    return this.fetchPlaces("http://localhost:3000/user-places", "Something went wrong fetching your favorite places. Please try again later.").pipe(tap({
      next: (userPlaces) => this.userPlaces.set(userPlaces)
    }))
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces=this.userPlaces();
    if(!prevPlaces.some((p)=> p.id===place.id)){
      this.userPlaces.set([...prevPlaces, place])
    }
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    }).pipe(
      catchError(error=>{
        this.userPlaces.set(prevPlaces);
        return throwError(()=> new Error("Failed to sstore selected place."))
      })
    )
  }

  removeUserPlace(place: Place) { }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((resData) => resData.places), catchError((error) => throwError(() => new Error(errorMessage)))
    )
  }
}
