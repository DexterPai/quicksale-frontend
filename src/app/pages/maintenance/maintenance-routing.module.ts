import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATH_MAINTENANCE_PAGES } from '../../commons/config/path-pages';
import { MaintenanceComponent } from './maintenance.component';

export const routes: Routes = [
	{
		path: '',
		component: MaintenanceComponent,
		children: [
			{
				path: PATH_MAINTENANCE_PAGES.buy.onlyPath,
				title: 'Eventos vendidos',
				loadComponent: () => import('./maintenance-buy-page/maintenance-buy-page.component')
			},
			{
				path: PATH_MAINTENANCE_PAGES.events.onlyPath,
				title: 'Eventos',
				loadComponent: () => import('./maintenance-events-page/maintenance-events-page.component')
			},
			{
				path: PATH_MAINTENANCE_PAGES.detailevents.onlyPath,
				title: 'Detalle Eventos',
				loadComponent: () => import('./maintenance-detailevents-page/maintenance-detailevents-page.component')
			},
			{
				path: PATH_MAINTENANCE_PAGES.categorys.onlyPath,
				title: 'Categorias',
				loadComponent: () => import('./maintenance-category-page/maintenance-category-page.component')
			},
			{
				path: PATH_MAINTENANCE_PAGES.reports.onlyPath,
				title: 'Reporte de ventas',
				loadComponent: () => import('./maintenance-reports/maintenance-reports.component')
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: PATH_MAINTENANCE_PAGES.buy.onlyPath
			}
		]
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MaintenanceRoutingModule {}
