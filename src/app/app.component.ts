import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import {
  Subject,
  debounceTime,
  filter,
  map,
  merge,
  shareReplay,
  switchMap,
} from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #api = inject(ApiService);

  form = this.#fb.group({ search: this.#fb.control('') });

  #refresh = new Subject<void>();

  coordinates$ = merge(this.form.valueChanges, this.#refresh).pipe(
    map(() => this.form.controls.search.value),
    filter((search) => !!search),
    debounceTime(300),
    switchMap((search) => this.#api.getCityCoordinates$(search)),
    shareReplay(1),
  );
  error$ = this.coordinates$.pipe(map((coordinates) => !coordinates.length));

  forecast$ = this.coordinates$.pipe(
    filter((coordinates) => !!coordinates.length),
    switchMap((coordinates) =>
      this.#api.getWeatherForecast$(coordinates[0].lat, coordinates[0].lon),
    ),
    shareReplay(1),
  );

  image$ = this.forecast$.pipe(
    switchMap((forecast) =>
      this.#api.getImage$(forecast.weather[0].description),
    ),
    map((result) => result.results[0].urls.small),
  );

  refresh() {
    this.#refresh.next();
  }
}
