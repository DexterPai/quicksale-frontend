import { Routes } from '@angular/router';
import { PATH_MY_ACCOUNT_PAGES } from '../../commons/config/path-pages';
import { MyAccountComponent } from './my-account.component';

export const routes: Routes = [
	{
		path: '',
		component: MyAccountComponent, //www.mitocode.com/maintenance
		children: [
			{
				path: PATH_MY_ACCOUNT_PAGES.buy.onlyPath,
				title: 'Mis compras',
				loadComponent: () =>
					import('./account-buy-page/account-buy-page.component').then((m) => m.AccountBuyPageComponent)
			},
			{
				path: PATH_MY_ACCOUNT_PAGES.changePassword.onlyPath,
				title: 'Cambiar contraseña',
				loadComponent: () =>
					import('./account-change-password-page/account-change-password-page.component').then(
						(m) => m.AccountChangePasswordPageComponent
					)
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: PATH_MY_ACCOUNT_PAGES.buy.onlyPath
			}
		]
	}
];
