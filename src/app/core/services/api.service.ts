import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Coord, WeatherForecast } from '@core/models';
import { ImageResult } from '@core/models/image';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly #http = inject(HttpClient);

  readonly #baseUrl = 'http://api.openweathermap.org';
  readonly #apiKey = '577b3bd2eec54e5a84a1ae825e746783';

  readonly #imageUrl = 'https://api.unsplash.com/search/photos';

  getCityCoordinates$(city: string) {
    return this.#http.get<Coord[]>(`${this.#baseUrl}/geo/1.0/direct`, {
      params: { q: city, limit: 5, appid: this.#apiKey },
    });
  }

  getWeatherForecast$(latitude: number, longitude: number) {
    return this.#http.get<WeatherForecast>(
      `${this.#baseUrl}/data/2.5/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.#apiKey,
          units: 'metric',
        },
      },
    );
  }

  getImage$(description: string) {
    return this.#http.get<ImageResult>(this.#imageUrl, {
      params: {
        page: 1,
        per_page: 1,
        query: description,
        client_id: '-cM96gY_B8y_F6Cu8G0OJJeKkEPJkML9_fuNrmtLnLU',
      },
    });
  }
}
