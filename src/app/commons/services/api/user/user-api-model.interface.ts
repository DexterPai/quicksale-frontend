//#region  LOGIN
export interface IRequestLogin {
	userName: string;
	password: string;
}

export interface IResponseLogin {
	token: string;
	fullName: string;
	roles: string[];
	success: boolean;
	errorMessage: string[];
}
//#endregion

export interface IRequestLoginv2 {
	email: string;
	password: string;
}

export interface IResponseLoginv2 {
	id: number;
	mensaje: string;
	name: string;
	success: boolean;
	roles: string;
}

//#region  REGISTER
export interface IRequestRegister {
	firstName: string;
	lastName: string;
	documentType: string;
	documentNumber: string;
	email: string;
	password: string;
	confirmPassword: string;
	age?: number;
	role?: string;
}

export interface IRequestRegisterv2 {
	fullName: string;
	dni: string;
	age?: number;
	email: string;
	password: string;
	status: string;
	roles?: string;
}
//#endregion

//#region  RESET PASWWORD
export interface IRequestResetPassword {
	email: string;
	token: string;
	newPassword: string;
}
//#endregion

//#region  CHANGE PASWWORD
export interface IRequestChangePassword {
	email: string;
	currentPassword: string;
	newPassword: string;
}
//#endregion
