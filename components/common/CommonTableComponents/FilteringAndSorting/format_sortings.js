const format_sortings = original_sortings => {
  return original_sortings.map(sorting => [
    sorting.id,
    sorting.desc ? 'DESC' : 'ASC'
  ]);
};
export default format_sortings;
