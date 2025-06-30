import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
	saludo?: string;
	constructor() {
		this.saludo = 'Hello AppComponent';
		console.log(this.saludo);
	}

	ngAfterViewInit(): void {
		console.log('ngAfterViewInit AppComponent');
	}

	ngOnInit(): void {
		console.log('ngOnInit AppComponent');
		//PUEDES HACER PEDIDOS DESDE AQUI
		//fetch('url').then((response) => {
		//	console.log(response);
		//});
	}
}
