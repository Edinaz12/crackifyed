import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable PostGIS extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "postgis"');

    // Create person table
    await queryRunner.query(
      `CREATE TABLE "person" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "age" integer NOT NULL,
        "gender" character varying(50) NOT NULL,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      )`,
    );

    // Create index on name
    await queryRunner.query(`CREATE INDEX "idx_person_name" ON "person" ("name")`);

    // Create person_image table
    await queryRunner.query(
      `CREATE TABLE "person_image" (
        "id" SERIAL NOT NULL,
        "personId" integer NOT NULL,
        "imageUrl" character varying(1024) NOT NULL,
        "imagePath" character varying(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE
      )`,
    );

    // Create date_rating table
    await queryRunner.query(
      `CREATE TABLE "date_rating" (
        "id" SERIAL NOT NULL,
        "personId" integer NOT NULL,
        "overallRating" integer NOT NULL CHECK ("overallRating" >= 1 AND "overallRating" <= 10),
        "kindnessRating" integer CHECK ("kindnessRating" IS NULL OR ("kindnessRating" >= 1 AND "kindnessRating" <= 10)),
        "conversationRating" integer CHECK ("conversationRating" IS NULL OR ("conversationRating" >= 1 AND "conversationRating" <= 10)),
        "humorRating" integer CHECK ("humorRating" IS NULL OR ("humorRating" >= 1 AND "humorRating" <= 10)),
        "comment" text,
        "dateOfDate" date NOT NULL,
        "locationName" character varying(512),
        "locationCoordinates" public.geometry(Point, 4326) NOT NULL,
        "instagramHandle" character varying(255),
        "phoneNumber" character varying(20),
        "snapchatHandle" character varying(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE
      )`,
    );

    // Create indexes on date_rating
    await queryRunner.query(`CREATE INDEX "idx_date_rating_personId" ON "date_rating" ("personId")`);
    await queryRunner.query(`CREATE INDEX "idx_date_rating_dateOfDate" ON "date_rating" ("dateOfDate")`);
    await queryRunner.query(
      `CREATE INDEX "idx_date_rating_locationCoordinates" ON "date_rating" USING GIST ("locationCoordinates")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "date_rating" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "person_image" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "person" CASCADE`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "postgis"`);
  }
}
