import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedFormCompleteModule } from '../../../commons/shared/shared-form-complete.module';

@Component({
	standalone: true,
	selector: 'app-maintenance-reports',
	templateUrl: './maintenance-reports.component.html',
	styleUrls: ['./maintenance-reports.component.scss'],
	imports: [RouterModule, SharedFormCompleteModule]
})
export default class MaintenanceReportsComponent {}
