import {
  BaseEntity,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  PrimaryKeyProp,
  PrimaryKeyType,
  Property,
  Ref,
} from "@mikro-orm/core";
import { Project } from "./project.mikro-model";
import { Organization } from "./organization.mikro-model";

@Entity()
export class ProjectUpdate extends BaseEntity<
  ProjectUpdate,
  "id" | "organization"
> {
  [PrimaryKeyType]?: [string, string];
  [PrimaryKeyProp]?: ["id", "organization_id"];

  @PrimaryKey({ columnType: "uuid" })
  id!: string;

  @ManyToOne({ entity: () => Organization, ref: true, primary: true })
  organization!: Ref<Organization>;

  @Property({ nullable: true })
  test?: string;

  // Mapping this side doesn't seem to help
  @OneToMany({
    entity: () => Project,
    mappedBy: "projectUpdate1",
    joinColumns: ["id", "organization_id"],
    fieldNames: ["pu1_id", "pu1_org_id"],
  })
  projects1 = new Collection<Project>(this);

  @OneToMany({
    entity: () => Project,
    mappedBy: "projectUpdate2",
    joinColumns: ["id", "organization_id"],
    fieldNames: ["pu2_id", "pu2_org_id"],
  })
  projects2 = new Collection<Project>(this);
}
