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
import { ProjectUpdate } from "./project-update.mikro-model";
import { Organization } from "./organization.mikro-model";

@Entity()
export class Project extends BaseEntity<Project, "id" | "organization"> {
  [PrimaryKeyType]?: [string, string];
  [PrimaryKeyProp]?: ["id", "organization_id"];

  @PrimaryKey({ columnType: "uuid" })
  id!: string;

  @ManyToOne({ entity: () => Organization, ref: true, primary: true })
  organization!: Ref<Organization>;

  @Property({ length: 255 })
  name!: string;

  /**
   * Setting field names helps with deduping but leads to bad ELSE statements like
   * "ELSE `p1_id`"
   */
  @ManyToOne({
    ref: true,
    entity: () => ProjectUpdate,
    joinColumns: ["project_id_1", "organization_id"],
    // fieldNames: ['p1_id', 'p1_org_id'],
  })
  projectUpdate1!: Ref<ProjectUpdate>;

  @ManyToOne({
    ref: true,
    entity: () => ProjectUpdate,
    joinColumns: ["project_id_2", "organization_id"],
    // fieldNames: ['p2_id', 'p2_org_id'],
  })
  projectUpdate2!: Ref<ProjectUpdate>;
}
