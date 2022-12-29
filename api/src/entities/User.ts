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
} from 'typeorm';

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

  async setPassword(newPassword: string): Promise<boolean> {
    if (!newPassword) {
      throw new InvalidPassword();
    }
    return new Promise(async (resolve) => {
      await User.createQueryBuilder('user')
        .update('user.password = sha512(user.salt + ":password")', { password: newPassword })
        .where('user.id = :userId', { userId: this.id });

      const returnQuery = await User.createQueryBuilder('user')
        .select('password')
        .where('user.id = :userId', { userId: this.id })
        .getOne();

      if (!returnQuery) {
        throw new InvalidPassword();
      }

      this.password = returnQuery.password;
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
