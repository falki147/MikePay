export function paginateResponse(arr, page = 1, perPage = 15) {
  const pageSize = Number(perPage);

  if (pageSize <= 0) {
    return {
      current_page: 1,
      total: arr.length,
      pages: 1,
      items: arr
    };
  }

  page = Math.max(1, Number(page));
  const slice = arr.slice((page - 1) * pageSize, page * pageSize);

  return {
    current_page: page,
    total: arr.length,
    pages: Math.ceil(arr.length / pageSize),
    items: slice
  };
}
