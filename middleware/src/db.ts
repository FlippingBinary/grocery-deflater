import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  NonAttribute,
  Association,
} from "sequelize";

const SQL_HOST = process.env["SQL_HOST"] ?? "";
const SQL_USER = process.env["SQL_USER"] ?? "";
const SQL_PASS = process.env["SQL_PASS"] ?? "";
const SQL_DB = process.env["SQL_DB"] ?? "";

let sequelize: Sequelize | null = null;

export class CategoryModel extends Model<
  InferAttributes<CategoryModel>,
  InferCreationAttributes<CategoryModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;

  // One category to many products
  declare products?: NonAttribute<ProductModel[]>;
  declare getProducts: HasManyGetAssociationsMixin<ProductModel>;
  declare addProduct: HasManyAddAssociationMixin<ProductModel, number>;
  declare addProducts: HasManyAddAssociationsMixin<ProductModel, number>;
  declare setProducts: HasManySetAssociationsMixin<ProductModel, number>;
  declare removeProduct: HasManyRemoveAssociationMixin<ProductModel, number>;
  declare removeProducts: HasManyRemoveAssociationsMixin<ProductModel, number>;
  declare hasProduct: HasManyHasAssociationMixin<ProductModel, number>;
  declare hasProducts: HasManyHasAssociationsMixin<ProductModel, number>;
  declare countProducts: HasManyCountAssociationsMixin;
  declare createProduct: HasManyCreateAssociationMixin<
    ProductModel,
    "categoryId"
  >;

  // One-to-many associations
  declare static associations: {
    products: Association<CategoryModel, ProductModel>;
  };
}

export class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare picture: string;

  // One product to many variants
  declare variants?: NonAttribute<VariantModel[]>;
  declare getVariants: HasManyGetAssociationsMixin<VariantModel>;
  declare addVariant: HasManyAddAssociationMixin<VariantModel, number>;
  declare addVariants: HasManyAddAssociationsMixin<VariantModel, number>;
  declare setVariants: HasManySetAssociationsMixin<VariantModel, number>;
  declare removeVariant: HasManyRemoveAssociationMixin<VariantModel, number>;
  declare removeVariants: HasManyRemoveAssociationsMixin<VariantModel, number>;
  declare hasVariant: HasManyHasAssociationMixin<VariantModel, number>;
  declare hasVariants: HasManyHasAssociationsMixin<VariantModel, number>;
  declare countVariants: HasManyCountAssociationsMixin;
  declare createVariant: HasManyCreateAssociationMixin<
    VariantModel,
    "productId"
  >;

  // Many products to one category
  declare categoryId: ForeignKey<CategoryModel["id"]>;
  declare category?: NonAttribute<CategoryModel>;

  // One-to-many associations
  declare static associations: {
    variants: Association<ProductModel, VariantModel>;
  };
}

export class MerchantModel extends Model<
  InferAttributes<MerchantModel>,
  InferCreationAttributes<MerchantModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  // One merchant to many locations
  declare locations?: NonAttribute<LocationModel[]>;
  declare getLocations: HasManyGetAssociationsMixin<LocationModel>;
  declare addLocation: HasManyAddAssociationMixin<LocationModel, number>;
  declare addLocations: HasManyAddAssociationsMixin<LocationModel, number>;
  declare setLocations: HasManySetAssociationsMixin<LocationModel, number>;
  declare removeLocation: HasManyRemoveAssociationMixin<LocationModel, number>;
  declare removeLocations: HasManyRemoveAssociationsMixin<
    LocationModel,
    number
  >;
  declare hasLocation: HasManyHasAssociationMixin<LocationModel, number>;
  declare hasLocations: HasManyHasAssociationsMixin<LocationModel, number>;
  declare countLocations: HasManyCountAssociationsMixin;
  declare createLocation: HasManyCreateAssociationMixin<
    LocationModel,
    "merchantId"
  >;

  // One-to-many associations
  declare static associations: {
    locations: Association<MerchantModel, LocationModel>;
  };
}

export class LocationModel extends Model<
  InferAttributes<LocationModel>,
  InferCreationAttributes<LocationModel>
> {
  declare id: CreationOptional<number>;
  declare streetNumber: string;
  declare streetName: string;
  declare zip: number;
  declare city: string;
  declare state: string;

  // One location to many variants
  declare variants?: NonAttribute<VariantModel[]>;
  declare getVariants: HasManyGetAssociationsMixin<VariantModel>;
  declare addVariant: HasManyAddAssociationMixin<VariantModel, number>;
  declare addVariants: HasManyAddAssociationsMixin<VariantModel, number>;
  declare setVariants: HasManySetAssociationsMixin<VariantModel, number>;
  declare removeVariant: HasManyRemoveAssociationMixin<VariantModel, number>;
  declare removeVariants: HasManyRemoveAssociationsMixin<VariantModel, number>;
  declare hasVariant: HasManyHasAssociationMixin<VariantModel, number>;
  declare hasVariants: HasManyHasAssociationsMixin<VariantModel, number>;
  declare countVariants: HasManyCountAssociationsMixin;
  declare createVariant: HasManyCreateAssociationMixin<
    VariantModel,
    "productId"
  >;

  // Many locations to one merchant
  declare merchantId: ForeignKey<MerchantModel["id"]>;
  declare merchant?: NonAttribute<MerchantModel>;

  // One-to-many associations
  declare static associations: {
    variants: Association<LocationModel, VariantModel>;
  };
}

export class VariantModel extends Model<
  InferAttributes<VariantModel>,
  InferCreationAttributes<VariantModel>
> {
  declare id: CreationOptional<number>;
  declare units: number;
  declare weight: number;
  declare price: number;

  // Many variants to one product
  declare productId: ForeignKey<ProductModel["id"]>;
  declare product?: NonAttribute<ProductModel>;

  // Many variants to one location
  declare locationId: ForeignKey<LocationModel["id"]>;
  declare location?: NonAttribute<LocationModel>;

  // One variant to many variant histories
  declare histories?: NonAttribute<VariantHistoryModel[]>;
  declare getHistories: HasManyGetAssociationsMixin<VariantHistoryModel>;
  declare addHistory: HasManyAddAssociationMixin<VariantHistoryModel, number>;
  declare addHistories: HasManyAddAssociationsMixin<
    VariantHistoryModel,
    number
  >;
  declare setHistories: HasManySetAssociationsMixin<
    VariantHistoryModel,
    number
  >;
  declare removeHistory: HasManyRemoveAssociationMixin<
    VariantHistoryModel,
    number
  >;
  declare removeHistories: HasManyRemoveAssociationsMixin<
    VariantHistoryModel,
    number
  >;
  declare hasHistory: HasManyHasAssociationMixin<VariantHistoryModel, number>;
  declare hasHistories: HasManyHasAssociationsMixin<
    VariantHistoryModel,
    number
  >;
  declare countHistories: HasManyCountAssociationsMixin;
  declare createHistory: HasManyCreateAssociationMixin<
    VariantHistoryModel,
    "variantId"
  >;
}

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare mobileNumber: string;

  // One user to many shopping lists
  declare productLists?: NonAttribute<ProductListModel[]>;
  declare getProductLists: HasManyGetAssociationsMixin<ProductListModel>;
  declare addProductList: HasManyAddAssociationMixin<ProductListModel, number>;
  declare addProductLists: HasManyAddAssociationsMixin<
    ProductListModel,
    number
  >;
  declare setProductLists: HasManySetAssociationsMixin<
    ProductListModel,
    number
  >;
  declare removeProductList: HasManyRemoveAssociationMixin<
    ProductListModel,
    number
  >;
  declare removeProductLists: HasManyRemoveAssociationsMixin<
    ProductListModel,
    number
  >;
  declare hasProductList: HasManyHasAssociationMixin<ProductListModel, number>;
  declare hasProductLists: HasManyHasAssociationsMixin<
    ProductListModel,
    number
  >;
  declare countProductLists: HasManyCountAssociationsMixin;
  declare createProductList: HasManyCreateAssociationMixin<
    ProductListModel,
    "ownerId"
  >;
}

export class ProductListModel extends Model<
  InferAttributes<ProductListModel>,
  InferCreationAttributes<ProductListModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  // Many shopping lists to one owner
  declare ownerId: ForeignKey<UserModel["id"]>;
  declare owner?: NonAttribute<UserModel>;

  // One shopping list to many shopping list items
  declare items?: NonAttribute<ProductListItemModel[]>;
  declare getItems: HasManyGetAssociationsMixin<ProductListItemModel>;
  declare addItem: HasManyAddAssociationMixin<ProductListItemModel, number>;
  declare addItems: HasManyAddAssociationsMixin<ProductListItemModel, number>;
  declare setItems: HasManySetAssociationsMixin<ProductListItemModel, number>;
  declare removeItem: HasManyRemoveAssociationMixin<
    ProductListItemModel,
    number
  >;
  declare removeItems: HasManyRemoveAssociationsMixin<
    ProductListItemModel,
    number
  >;
  declare hasItem: HasManyHasAssociationMixin<ProductListItemModel, number>;
  declare hasItems: HasManyHasAssociationsMixin<ProductListItemModel, number>;
  declare countItems: HasManyCountAssociationsMixin;
  declare createItem: HasManyCreateAssociationMixin<
    ProductListItemModel,
    "productListId"
  >;
}

export class ProductListItemModel extends Model<
  InferAttributes<ProductListItemModel>,
  InferCreationAttributes<ProductListItemModel>
> {
  declare id: CreationOptional<number>;
  declare quantity: number;

  // One product list item to one product
  declare productId: ForeignKey<ProductModel["id"]>;
  declare product?: NonAttribute<ProductModel>;

  // Many product lists items to one product list
  declare productListId: ForeignKey<ProductListModel["id"]>;
  declare productList?: NonAttribute<ProductListModel>;
}

export class VariantHistoryModel extends Model<
  InferAttributes<VariantHistoryModel>,
  InferCreationAttributes<VariantHistoryModel>
> {
  declare revision: CreationOptional<number>;
  declare action: CreationOptional<string>;
  declare timestamp: CreationOptional<Date>;
  declare units: number;
  declare weight: number;
  declare price: number;
  declare productId: number;

  // Many variant histories to one variant
  declare variantId: ForeignKey<VariantModel["id"]>;
  declare variant?: NonAttribute<VariantModel>;

  // Many variants to one location
  declare locationId: ForeignKey<LocationModel["id"]>;
  declare location?: NonAttribute<LocationModel>;
}

export async function loadSequelize() {
  if (sequelize !== null) {
    sequelize.connectionManager.initPools();
    return sequelize;
  }
  sequelize = new Sequelize(SQL_DB, SQL_USER, SQL_PASS, {
    host: SQL_HOST,
    dialect: "mysql",
    dialectOptions: {
      ssl: "Amazon RDS",
    },
    pool: { max: 1, min: 0, idle: 0, acquire: 3000, evict: 500 },
  });

  CategoryModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "Category_id",
      },
      name: {
        type: DataTypes.STRING,
        field: "Category_Name",
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        field: "Category_Description",
      },
    },
    {
      sequelize,
      modelName: "CategoryModel",
      tableName: "CATEGORY",
      timestamps: false,
    }
  );

  ProductModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "Product_id",
      },
      name: {
        type: DataTypes.STRING,
        field: "Product_name",
        unique: true,
      },
      picture: {
        type: DataTypes.STRING,
        field: "Picture",
      },
    },
    {
      sequelize,
      modelName: "ProductModel",
      tableName: "PRODUCT",
      timestamps: false,
    }
  );

  MerchantModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "store_id",
      },
      name: {
        type: DataTypes.STRING,
        field: "store_name",
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "MerchantModel",
      tableName: "STORE",
      timestamps: false,
    }
  );

  LocationModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "Address_id",
      },
      streetNumber: {
        type: DataTypes.STRING,
        field: "Address_1",
      },
      streetName: {
        type: DataTypes.STRING,
        field: "Address_2",
      },
      zip: {
        type: DataTypes.INTEGER,
        field: "zip_code",
      },
      city: {
        type: DataTypes.STRING,
        field: "city",
      },
      state: {
        type: DataTypes.STRING,
        field: "state",
      },
    },
    {
      sequelize,
      modelName: "LocationModel",
      tableName: "STORELOCATION",
      timestamps: false,
    }
  );

  VariantModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "Productitem_id",
      },
      units: {
        type: DataTypes.INTEGER,
        field: "Units",
      },
      weight: {
        type: DataTypes.DOUBLE,
        field: "Weight",
      },
      price: {
        type: DataTypes.DOUBLE,
        field: "Price",
      },
    },
    {
      sequelize,
      modelName: "VariantModel",
      tableName: "PRODUCTITEM",
      timestamps: false,
    }
  );

  VariantHistoryModel.init(
    {
      variantId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "Productitem_id",
      },
      revision: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "revision",
      },
      action: {
        type: DataTypes.STRING,
        field: "action",
      },
      timestamp: {
        type: DataTypes.DATE,
        field: "dt_datetime",
      },
      units: {
        type: DataTypes.INTEGER,
        field: "Units",
      },
      weight: {
        type: DataTypes.DOUBLE,
        field: "Weight",
      },
      price: {
        type: DataTypes.DOUBLE,
        field: "Price",
      },
      productId: {
        type: DataTypes.INTEGER,
        field: "Product_id",
      },
    },
    {
      sequelize,
      modelName: "VariantHistoryModel",
      tableName: "PRODUCTITEM_HIST",
      timestamps: false,
    }
  );

  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "user_id",
      },
      email: {
        type: DataTypes.STRING,
        field: "email_id",
      },
      password: {
        type: DataTypes.STRING,
        field: "password",
      },
      firstName: {
        type: DataTypes.STRING,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING,
        field: "last_name",
      },
      mobileNumber: {
        type: DataTypes.STRING,
        field: "mobile_no",
      },
    },
    {
      sequelize,
      modelName: "UserModel",
      tableName: "USER",
      timestamps: false,
    }
  );

  ProductListModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "shoppinglist_id",
      },
      name: {
        type: DataTypes.STRING,
        field: "Name",
      },
    },
    {
      sequelize,
      modelName: "ProductListModel",
      tableName: "SHOPPINGLIST",
      timestamps: false,
    }
  );

  ProductListItemModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "shoppinglistitem_id",
      },
      quantity: {
        type: DataTypes.INTEGER,
        field: "QUANTITY",
      },
    },
    {
      sequelize,
      modelName: "ProductListItemModel",
      tableName: "SHOPPINGLISTITEM",
      timestamps: false,
    }
  );

  // Each product is in a category
  CategoryModel.hasMany(ProductModel, {
    foreignKey: {
      name: "categoryId",
      field: "Category_id",
    },
    as: "products",
  });
  ProductModel.belongsTo(CategoryModel, {
    foreignKey: {
      name: "categoryId",
      field: "Category_id",
    },
    as: "category",
  });

  // Each product has many variants
  ProductModel.hasMany(VariantModel, {
    foreignKey: {
      name: "productId",
      field: "Product_id",
    },
    as: "variants",
  });
  VariantModel.belongsTo(ProductModel, {
    foreignKey: {
      name: "productId",
      field: "Product_id",
    },
    as: "product",
  });

  // Each location has many variants
  LocationModel.hasMany(VariantModel, {
    foreignKey: {
      name: "locationId",
      field: "Address_id",
    },
    as: "variants",
  });
  VariantModel.belongsTo(LocationModel, {
    foreignKey: {
      name: "locationId",
      field: "Address_id",
    },
    as: "location",
  });

  // Each merchant has many locations
  MerchantModel.hasMany(LocationModel, {
    foreignKey: {
      name: "merchantId",
      field: "store_id",
    },
    as: "locations",
  });
  LocationModel.belongsTo(MerchantModel, {
    foreignKey: {
      name: "merchantId",
      field: "store_id",
    },
    as: "merchant",
  });

  // Each variant has many history events
  VariantModel.hasMany(VariantHistoryModel, {
    foreignKey: {
      name: "variantId",
      field: "Productitem_id",
    },
    as: "histories",
  });
  VariantHistoryModel.belongsTo(VariantModel, {
    foreignKey: {
      name: "variantId",
      field: "Productitem_id",
    },
    as: "variant",
  });

  // Each user has many product lists
  UserModel.hasMany(ProductListModel, {
    foreignKey: {
      name: "ownerId",
      field: "user_id",
    },
    as: "productLists",
  });
  ProductListModel.belongsTo(UserModel, {
    foreignKey: {
      name: "ownerId",
      field: "user_id",
    },
    as: "owner",
  });

  // Each product list has many product list items
  ProductListModel.hasMany(ProductListItemModel, {
    foreignKey: {
      name: "shoppingListId",
      field: "shoppinglist_id",
    },
    as: "items",
  });
  ProductListItemModel.belongsTo(ProductListModel, {
    foreignKey: {
      name: "shoppingListId",
      field: "shoppinglist_id",
    },
    as: "productList",
  });

  // Each product list item has one product
  ProductListItemModel.belongsTo(ProductModel, {
    foreignKey: {
      name: "productId",
      field: "Product_id",
    },
    as: "product",
  });

  // ProductModel.hasOne(CategoryModel, { sourceKey: "id" });

  // VariantModel.hasOne(ProductModel, { sourceKey: "id" });

  await sequelize.authenticate();

  return sequelize;
}

export async function unloadSequelize() {
  // if (sequelize !== null) {
  //   await sequelize.connectionManager.close();
  // }
}
