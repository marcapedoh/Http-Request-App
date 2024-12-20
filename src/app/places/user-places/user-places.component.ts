import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false)
  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  error = signal('')
  places = signal<Place[] | undefined>(undefined)
  ngOnInit(): void {
    this.isFetching.set(true)
    const subscription = this.placeService.loadUserPlaces().subscribe({
      next: (places) => {
        this.places.set(places)
      },
      error: (error) => {
        console.log(error.message)
        this.error.set("Something went wrong fetching your favorite places. Please try again later.")
        this.isFetching.set(false)
      },
      // unsubscribe: () => {
      complete: () => {
        this.isFetching.set(false)
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}
