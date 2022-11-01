import { Op } from "sequelize";
import { CategoryModel } from "./db";
import { QueryCategoriesArgs } from "./generated/graphql";

export async function categoriesResolver({
  args,
}: {
  args: Partial<QueryCategoriesArgs>;
}) {
  const filterBy = args.filterBy;
  const categorySearch = {} as any;
  if (!!filterBy?.name) {
    categorySearch.where = categorySearch.where ?? {};
    categorySearch.where.name = {};
    if (filterBy.name.startsWith !== undefined) {
      categorySearch.where.name[Op.startsWith] = filterBy.name.startsWith;
    }
    if (filterBy.name.endsWith !== undefined) {
      categorySearch.where.name[Op.endsWith] = filterBy.name.endsWith;
    }
    if (filterBy.name.matches !== undefined) {
      categorySearch.where.name[Op.eq] = filterBy.name.matches;
    }
  }
  if (!!filterBy?.id) {
    categorySearch.where = categorySearch.where ?? {};
    categorySearch.where.id = filterBy.id;
  }
  if (!!filterBy?.description) {
    categorySearch.where = categorySearch.where ?? {};
    categorySearch.where.description = {};
    if (filterBy.description.startsWith !== undefined) {
      categorySearch.where.description[Op.startsWith] =
        filterBy.description.startsWith;
    }
    if (filterBy.description.endsWith !== undefined) {
      categorySearch.where.description[Op.endsWith] =
        filterBy.description.endsWith;
    }
    if (filterBy.description.matches !== undefined) {
      categorySearch.where.description[Op.eq] = filterBy.description.matches;
    }
  }
  const categories = await CategoryModel.findAll(categorySearch);
  console.log("About to return Product");
  return categories.map((category) => ({
    id: category.id.toString(),
    name: category.name,
    description: category.description,
  }));
}
