import { serviceCategoryGetAll } from '../service/service_category';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const res = await serviceCategoryGetAll();

	return {
		serviceCategories: res.data
	};
};
