import { GraphQLError } from "graphql";
import { ProductListModel } from "./db";
import {
  List,
  MutationAddToListArgs,
  QueryListArgs,
  RequireFields,
} from "./generated/graphql";

/**
 * This resolver returns properties about a user's product list.
 * @param param0 An object containing a reference to a `list`
 * @returns
 */
export async function listResolver({ args }: { args: Partial<QueryListArgs> }): Promise<List> {
  const id = args?.filterBy?.id;
  if (id !== undefined) {
    const list = await ProductListModel.findByPk(parseInt(id));
    if (!list) return null;

    return {
      id: list.id.toString(),
      name: list.name,
    };
  }
  const userId = args?.filterBy?.userId;
  if (userId !== undefined) {
    const list = await ProductListModel.findOne({
      where: {
        ownerId: parseInt( userId )
      }
    });
    if (!list) return null;

    return {
      id: list.id.toString(),
      name: list.name,
    }
  }
  const name = args?.filterBy?.name;
  if (name !== undefined) {
    const list = await ProductListModel.findOne({
      where: {
        name: name
      }
    });
    if (!list) return null;

    return {
      id: list.id.toString(),
      name: list.name,
    }
  }
}

/**
 * This mutation adds a product to a user's product list.
 * @param args An object containing `listId` and `productId`
 * @returns
 */
export async function addToListMutation(
  args: RequireFields<MutationAddToListArgs, "input">
): Promise<List> {
  const { listId, productId } = args.input;
  const list = await ProductListModel.findByPk(parseInt(listId));
  if (!list) return null;

  try {
    list.addItem(parseInt(productId));
    await list.save();
  } catch (e) {
    throw new GraphQLError(e);
  }

  return {
    id: list.id.toString(),
    name: list.name,
  };
}
