import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  RelationId,
  AfterInsert,
  BeforeInsert,
} from 'typeorm';

import Cryptgen from 'utils/cryptgen';
import is from 'utils/validation';
import { Comment, Issue, Project } from '.';
import { InvalidPassword } from 'errors/customErrors';

@Entity()
class User extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    email: [is.required(), is.email(), is.maxLength(200)],
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar', { nullable: true })
  password: string;

  @Column('varchar', { nullable: true })
  salt: string;

  @Column('varchar', { length: 2000 })
  avatarUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => Comment,
    comment => comment.user,
  )
  comments: Comment[];

  @ManyToMany(
    () => Issue,
    issue => issue.users,
  )
  issues: Issue[];

  @ManyToOne(
    () => Project,
    project => project.users,
  )
  project: Project;

  @RelationId((user: User) => user.project)
  projectId: number;

  @BeforeInsert()
  setSalt(): void {
    this.salt = Cryptgen.random(32);
  }

  @AfterInsert()
  async setUserPasswordOnCreate(): Promise<void> {
    const pass = this.password || Cryptgen.random(16);

    console.log('Setting user password to', pass);

    this.setPassword(pass);
  }

  static async isValidLogin(email: string, password: string): Promise<User | null> {
    return new Promise(async (resolve) => {
      const returnQuery = await User.createQueryBuilder('user')
        .select('user.id')
        .where('user.email = :email and user.password = encode(sha512(concat(:password::text, salt)::bytea), \'hex\')', { email, password })
        .getOne();

      resolve(!returnQuery ? null : returnQuery); // Valid Login.
    });
  }

  async setPassword(newPassword: string): Promise<boolean> {
    if (!newPassword) {
      throw new InvalidPassword();
    }

    return new Promise(async (resolve) => {
      const val = await User.createQueryBuilder('user')
        .select('encode(sha512(\'' + newPassword + this.salt + '\'::bytea), \'hex\')')
        .getRawOne();

      console.log('Value of Val', val, 'on', this);

      this.password = val.encode;
      this.save();
      resolve(true);
    });
  }

  getSalt(): string {
    if (this.salt) {
      return this.salt;
    }
    // generate new salt.
    // this.salt = salt;

    return '';
  }
}

export default User;
