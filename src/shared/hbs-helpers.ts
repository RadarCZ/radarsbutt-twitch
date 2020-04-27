import { IHbsHelper, HbsHelperBoolHandler } from './types/HbsTypes';

class StringsEqualHandler implements IHbsHelper {
	public callName = 'strings_equal';

	public handler: HbsHelperBoolHandler = (string1: string, string2: string) => {
		return Boolean(string1) && Boolean(string2) && string1 === string2;
	}
}

export const HbsHelpers: readonly IHbsHelper[] = <const>[
	new StringsEqualHandler()
];
