export type HbsHelperVoidHandler = (...args: any[]) => void;
export type HbsHelperBoolHandler = (...args: any[]) => boolean;

type HbsHelperHandler = HbsHelperVoidHandler | HbsHelperBoolHandler;

export interface IHbsHelper {
	callName: string;
	handler: HbsHelperHandler;
}