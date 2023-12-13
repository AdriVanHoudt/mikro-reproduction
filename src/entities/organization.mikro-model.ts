import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from "@mikro-orm/core";

@Entity()
export class Organization extends BaseEntity<Organization, "id"> {
  [PrimaryKeyType]?: string;

  @PrimaryKey({ columnType: "uuid" })
  id!: string;
}
