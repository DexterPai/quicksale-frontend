import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DemoCorsService {
	constructor(private http: HttpClient) {}

	private urlApiv2 = 'http://localhost:8080/api/category/1';
	private urlApi = 'https://rickandmortyapi.com/api/character/1,183';

	getGreeting(): Observable<unknown> {
		// return this.http.get<unknown>('http://localhost:8080/apidemo/greeting'); localhost:8080/category
		return this.http.get<unknown>('http://localhost:8080/api/category/1');
	}

	public getData(): Observable<any> {
		return this.http.get<any>(this.urlApiv2);
	}
}
