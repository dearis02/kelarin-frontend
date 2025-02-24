import { serviceGetByID } from '../../../service/service';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const res = await serviceGetByID(params.id);

	return {
		service: res.data
	};
};
