import {MigrationInterface, QueryRunner} from "typeorm";

export class removeSalt1590518230082 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user','salt')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
