import { LocationModel } from "./db";
import { Location, Merchant } from "./generated/graphql";

export async function locationResolver({
  merchant,
}: {
  merchant?: Merchant;
}): Promise<Location | null> {
  if (!!merchant) {
    const location = await LocationModel.findByPk(parseInt(merchant.id));
    if (!location) return null;
    return {
      address: `${location.streetNumber} ${location.streetName}`,
      city: location.city,
      state: location.state,
      zip: location.zip.toString().padStart(5, "0"),
    };
  }
}
