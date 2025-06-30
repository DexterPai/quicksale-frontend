import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PATHS_AUTH_PAGES } from '../../commons/config/path-pages';
import { SharedFormBasicModule } from '../../commons/shared/shared-form-basic.module';

@Component({
	standalone: true,
	selector: 'app-restore-password-page',
	templateUrl: './restore-password-page.component.html',
	styleUrls: ['./restore-password-page.component.scss'],
	imports: [RouterModule, SharedFormBasicModule]
})
export default class RestorePasswordPageComponent {
	private _token?: string;
	private _email?: string;

	constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {
		this._captureData();
	}

	private _captureData(): void {
		// capturamos los datos enviados por la opción "state"
		const navigation = this._router.getCurrentNavigation();

		if (navigation?.extras && navigation.extras.state) {
			this._token = navigation.extras.state['token'] as string;
		}

		// capturamos los datos enviados por PATH PARAM
		if (this._activatedRoute.snapshot.params['email']) {
			this._email = this._activatedRoute.snapshot.params['email'] as string;
		}

		// capturamos los datos enviados por QUERY PARAM
		if (this._activatedRoute.snapshot.queryParams) {
			console.log(this._activatedRoute.snapshot.queryParams);
		}
		console.log(`Token :${this._token}, Email : ${this._email}`);
		// en caso no existiera eltoken o el email enviaremos al usuario a la pagina de "Recuperar contraseña"
		if (!this._token || !this._email) {
			void this._router.navigateByUrl(PATHS_AUTH_PAGES.recoverPasswordPage.withSlash);
		}
	}
}
