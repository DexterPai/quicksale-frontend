import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { IResponse } from './../api-models-base.interface';
import { IRequestCreateUpdateGenre, IResponseGenre } from './genre-api-model.interface';

export const URL_GENRE = environment.host + '/Genres';

@Injectable({
	providedIn: 'root'
})
export class GenreApiService {
	constructor(private _httpClient: HttpClient) {}

	createGenre(request: IRequestCreateUpdateGenre): Observable<IResponse<number>> {
		return this._httpClient.post<IResponse<number>>(URL_GENRE, request);
	}

	getGenres(): Observable<IResponse<IResponseGenre[]>> {
		return this._httpClient.get<IResponse<IResponseGenre[]>>(URL_GENRE);
	}

	getGenre(id: number): Observable<IResponse<IResponseGenre>> {
		const url = `${URL_GENRE}/${id}`;
		return this._httpClient.get<IResponse<IResponseGenre>>(url);
	}

	updateGenre(id: number, request: Partial<IRequestCreateUpdateGenre>): Observable<IResponse<number>> {
		const url = `${URL_GENRE}/${id}`;
		return this._httpClient.put<IResponse<number>>(url, request);
	}

	deleteGenre(id: number): Observable<IResponse<number>> {
		const url = `${URL_GENRE}/${id}`;
		return this._httpClient.delete<IResponse<number>>(url);
	}
}
