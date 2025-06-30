import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardMenusComponent } from '../../commons/components/card-menus/card-menus.component';
import { PATH_MAINTENANCE_PAGES } from '../../commons/config/path-pages';
import { ICardMenu } from '../../commons/models/components.interface';

@Component({
	standalone: true,
	selector: 'app-maintenance',
	templateUrl: './maintenance.component.html',
	styleUrls: ['./maintenance.component.scss'],
	imports: [CardMenusComponent, RouterModule]
})
export class MaintenanceComponent {
	readonly menuAdmin: ICardMenu[] = [
		{
			title: 'VENTAS',
			nameImage: 'buys.png',
			active: true,
			path: PATH_MAINTENANCE_PAGES.buy.withSlash
		},
		{
			title: 'EVENTOS',
			nameImage: 'events.png',
			active: false,
			path: PATH_MAINTENANCE_PAGES.events.withSlash
		},
		{
			title: 'DETALLE \n EVENTOS',
			nameImage: 'detalle.png',
			active: false,
			path: PATH_MAINTENANCE_PAGES.detailevents.withSlash
		},
		{
			title: 'CATEGORIAS',
			nameImage: 'category.jpg',
			active: false,
			path: PATH_MAINTENANCE_PAGES.categorys.withSlash
		},
		/*
		{
			title: 'GENEROS',
			nameImage: 'genres.png',
			active: false,
			path: PATH_MAINTENANCE_PAGES.genres.withSlash
		},
		*/
		{
			title: 'REPORTES',
			nameImage: 'statistics.png',
			active: false,
			path: PATH_MAINTENANCE_PAGES.reports.withSlash
		}
	];
}
