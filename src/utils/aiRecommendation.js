// Rule-based AI recommendation (demo)
export const getRecommendations = (userOrders, allFood) => {
  if (!userOrders || userOrders.length === 0) return allFood.slice(0, 5);

  const categories = userOrders.map(o => o.category); // assuming food has category
  const topCategory = categories.sort((a,b) =>
    categories.filter(c => c===a).length - categories.filter(c => c===b).length
  ).pop();

  return allFood.filter(f => f.category === topCategory).slice(0,5);
};
