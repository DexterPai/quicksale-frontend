export interface IResponse<T = void> {
	data: T; // data: IResponseGenre[]
	success: boolean;
	errorMessage: string;
}

export interface IResponsev2<T = void> {
	mensaje: string;
	object: T; // data: IResponseGenre[]
	success: boolean;
}
