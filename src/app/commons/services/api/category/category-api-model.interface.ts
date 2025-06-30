//#region  GET CATEGORY
export interface IResponseCategory {
	idCategory: number;
	description: string;
	status: string;
}
//#endregion

//#region CREATE CATEGORY
export interface IRequestCreateUpdateCategory {
	idCategory: number;
	description: string;
	status: string;
}
//#endregion
