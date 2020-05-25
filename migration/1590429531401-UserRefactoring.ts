import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class UserRefactoring1590429531401 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          }, {
            name: 'mobile',
            type: 'bigint',
            length: '20',
            isUnique: true,
            isNullable: false,
          }, {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          }, {
            name: 'avatarUri',
            type: 'text',
            isNullable: false,
          }, {
            name: 'zone',
            type: 'varchar',
            length: '255',
            isNullable: false,
          }, {
            name: 'password',
            type: 'varchar',
            length: '255',
          }, {
            name: 'salt',
            type: 'varchar',
            length: '255',
          }, {
            name: 'gender',
            type: 'tinyint',
            default: 1,
          }, {
            name: 'role',
            type: 'tinyint',
            default: 0,
          }, {
            name: 'status',
            type: 'tinyint',
            default: 1,
          }, {
            name: 'isSuper',
            type: 'tinyint',
            default: 0,
          }, {
            name: 'createTime',
            type: 'bigint',
            length: '20',
          }, {
            name: 'updateTime',
            type: 'bigint',
            length: '20',
          },
        ],
      }), true,
    );
    await queryRunner.createIndex('user', new TableIndex({
      name: 'IDX_USER_NAME',
      columnNames: ['name'],
    }));
    await queryRunner.createIndex('user', new TableIndex({
      name: 'IDX_USER_MOBILE',
      columnNames: ['mobile'],
    }));
    await queryRunner.createIndex('user', new TableIndex({
      name: 'IDX_USER_EMAIL',
      columnNames: ['email'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table  = await queryRunner.getTable("user")
    await queryRunner.dropIndex("user","IDX_USER_EMAIL")
    await queryRunner.dropIndex("user","IDX_USER_MOBILE")
    await queryRunner.dropIndex("user","IDX_USER_NAME")
    await queryRunner.dropTable("user")
  }

}
