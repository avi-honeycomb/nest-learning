import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileImageToUsers1776753520549 implements MigrationInterface {
    name = 'AddProfileImageToUsers1776753520549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_image"`);
    }

}
