import { Component } from '@angular/core';
import { CardMenusComponent } from '../../commons/components/card-menus/card-menus.component';
import { PATH_MY_ACCOUNT_PAGES } from 'src/app/commons/config/path-pages';
import { ICardMenu } from 'src/app/commons/models/components.interface';
import { RouterModule } from '@angular/router';

@Component({
	standalone: true,
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.scss'],
	imports: [CardMenusComponent, RouterModule]
})
export class MyAccountComponent {
	readonly menuAdmin: ICardMenu[] = [
		{
			title: 'MIS COMPRAS',
			nameImage: 'buys.png',
			active: true,
			path: PATH_MY_ACCOUNT_PAGES.buy.withSlash
		},
		{
			title: 'CAMBIAR CONTRASEÑA',
			nameImage: 'change-password.png',
			active: false,
			path: PATH_MY_ACCOUNT_PAGES.changePassword.withSlash
		}
	];
}
