import { MikroORM } from "@mikro-orm/postgresql";
import { v4 as uuidV4 } from "uuid";

import { Project } from "./entities/project.mikro-model";
import { ProjectUpdate } from "./entities/project-update.mikro-model";
import { Organization } from "./entities/organization.mikro-model";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: "postgres",
    user: "postgres",
    password: "postgres",
    host: "localhost",
    entities: ["dist/**/*.mikro-model.js"],
    entitiesTs: ["src/**/*.mikro-model.ts"],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
    persistOnCreate: true,
    forceUtcTimezone: true,
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test.only("bulk update props with compound keys", async () => {
  const globalEm = orm.em.fork();
  const projectId = uuidV4();
  const projectId2 = uuidV4();
  const updateId2 = uuidV4();
  const updateId = uuidV4();
  const orgId = uuidV4();

  const initEm = globalEm.fork();
  const org = new Organization();
  org.assign({ id: orgId }, { em: initEm });

  await initEm.persistAndFlush(org);

  const projectUpdate1 = new ProjectUpdate();
  projectUpdate1.assign(
    {
      id: updateId,
      organization: orgId,
    },
    { em: initEm },
  );

  const projectUpdate2 = new ProjectUpdate();
  projectUpdate2.assign(
    {
      id: updateId2,
      organization: orgId,
    },
    { em: initEm },
  );

  const project = new Project();
  project.assign(
    {
      id: projectId,
      organization: orgId,
      name: "init",
      projectUpdate1,
      projectUpdate2,
    },
    { em: initEm },
  );
  const project2 = new Project();
  project2.assign(
    {
      id: projectId2,
      organization: orgId,
      name: "init2",
      projectUpdate1,
      projectUpdate2,
    },
    { em: initEm },
  );

  initEm.persist(project);
  initEm.persist(project2);

  await initEm.flush();

  //// new request

  const em = orm.em.fork();

  const p1 = em.getReference(Project, [projectId, orgId]);
  const p2 = em.getReference(Project, [projectId2, orgId]);

  // Switch project update ids to trigger updates
  em.assign(p1, {
    name: "update",
    projectUpdate1: em.getReference(ProjectUpdate, [updateId2, orgId]),
    projectUpdate2: em.getReference(ProjectUpdate, [updateId, orgId]),
  });

  em.assign(p2, {
    name: "update",
    projectUpdate1: em.getReference(ProjectUpdate, [updateId2, orgId]),
    projectUpdate2: em.getReference(ProjectUpdate, [updateId, orgId]),
  });

  em.persist(p1);
  em.persist(p2);

  await em.flush();
});
