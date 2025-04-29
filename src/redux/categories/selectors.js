


//  Селектор для получения списка всех категорий
export const selectAllCategories = state => state.categories.list;

//  Селектор для получения статуса загрузки категорий
export const selectIsLoadingCategories = state => state.categories.isLoading;

//  Селектор для получения ошибки загрузки категорий
export const selectCategoriesError = state => state.categories.error;
