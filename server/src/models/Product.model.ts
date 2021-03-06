import { getModelForClass, prop as Property, Ref } from "@typegoose/typegoose";
import { MaxLength } from "class-validator";
import { Schema } from "mongoose";
import { Field, ObjectType } from "type-graphql";

import { Seller } from "./Seller.model";
import { ProductReview } from "./ProductReview.model";
import { ProductCategory } from "./ProductCategory.model";

@ObjectType()
export class Product {
  @Field(() => String)
  readonly _id: string;

  @Field(() => String)
  @Property({
    required: [true, "Product name is required"],
    trim: true,
    type: Schema.Types.String,
  })
  public name: string;

  @Field(() => String)
  @Property({
    required: [true, "Product seller is required"],
    ref: "Seller",
    type: Schema.Types.ObjectId,
  })
  public seller: Ref<Seller>;
  @Field(() => Seller)
  public sellerObj: Seller;

  @Field(() => String)
  @Property({
    default: "product/unknown.png",
    type: Schema.Types.String,
  })
  public primaryImage: string;

  @Field(() => String)
  @Property({
    default: ["product/unknown.png"],
    type: Schema.Types.String,
  })
  public images: string;

  @Field(() => String, { nullable: true })
  @Property({
    type: Schema.Types.String,
  })
  public brand?: string;

  @Field(() => String)
  @Property({
    required: [true, "Category is required"],
    ref: "ProductCategory",
    type: Schema.Types.ObjectId,
  })
  public category: Ref<ProductCategory>;
  @Field(() => ProductCategory)
  public categoryObj: ProductCategory;

  @MaxLength(2048, {
    message: "Bio cannot be longer than 2048 characters",
  })
  @Field(() => String, { nullable: true })
  @Property({
    type: Schema.Types.String,
  })
  public description?: string;

  @Field(() => Number)
  @Property({
    required: [true, "Product price is required"],
    type: Schema.Types.Number,
  })
  public price: number;

  @Field(() => Number)
  @Property({
    // Unlimited quantity
    default: -1,
    type: Schema.Types.Number,
  })
  public stock: number;

  @Field(() => Number)
  @Property({
    default: 0,
    type: Schema.Types.Number,
  })
  public rating: number;

  @Field(() => [String])
  @Property({
    ref: "ProductReview",
    default: [],
    type: Schema.Types.ObjectId,
  })
  public reviews: Ref<ProductReview>[];
  @Field(() => [ProductReview], {
    defaultValue: [],
  })
  public reviewsObj: ProductReview[];

  @Field(() => Date)
  @Property({
    type: Schema.Types.Date,
  })
  public createdAt: Date;

  @Field(() => Date)
  @Property({
    type: Schema.Types.Date,
  })
  public updatedAt: Date;
}

export const ProductModel = getModelForClass<typeof Product>(Product, {
  schemaOptions: { timestamps: true },
});
