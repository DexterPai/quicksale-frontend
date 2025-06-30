import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContainerModule } from './commons/components/container/container.module';

//IMPORTANTE
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

import LocalEsPe from '@angular/common/locales/es-PE';
import { ApiInterceptor } from './commons/intercerptors/api.interceptor';
import { ErrorInterceptor } from './commons/intercerptors/error.interceptor';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {
	ConfirmBoxConfigModule,
	DialogConfigModule,
	NgxAwesomePopupModule,
	ToastNotificationConfigModule
} from '@costlydeveloper/ngx-awesome-popup';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideStorage, getStorage } from '@angular/fire/storage';
registerLocaleData(LocalEsPe);

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		ContainerModule,
		NgxUiLoaderModule,
		NgxAwesomePopupModule.forRoot(), // Essential, mandatory main module.
		DialogConfigModule.forRoot(), // Needed for instantiating dynamic components.
		ConfirmBoxConfigModule.forRoot(), // Needed for instantiating confirm boxes.
		ToastNotificationConfigModule.forRoot(),
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideStorage(() => getStorage()) // Needed for instantiating toast notifications.
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-PE' },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
//{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }, Interceptor de sessión
