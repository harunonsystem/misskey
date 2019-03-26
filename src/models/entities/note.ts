import { Entity, Index, OneToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { App } from './app';
import { DriveFile } from './drive-file';

@Entity()
export class Note {
	@PrimaryColumn('char', { length: 26 })
	public id: string;

	@Index()
	@Column('date', {
		comment: 'The created date of the Note.'
	})
	public createdAt: Date;

	@Index()
	@Column('date', {
		nullable: true,
		comment: 'The updated date of the Note.'
	})
	public updatedAt: Date | null;

	@Index()
	@Column('integer', {
		nullable: true,
		comment: 'The ID of reply target.'
	})
	public replyId: Note['id'] | null;

	@OneToOne(type => Note, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public reply: Note | null;

	@Index()
	@Column('integer', {
		nullable: true,
		comment: 'The ID of renote target.'
	})
	public renoteId: Note['id'] | null;

	@OneToOne(type => Note, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public renote: Note | null;

	@Column({
		type: 'text', nullable: true
	})
	public text: string | null;

	@Column('varchar', {
		length: 256, nullable: true
	})
	public name: string | null;

	@Column('varchar', {
		length: 512, nullable: true
	})
	public cw: string | null;

	@Column('integer')
	public appId: App['id'];

	@OneToOne(type => App, {
		onDelete: 'SET NULL'
	})
	@JoinColumn()
	public app: App | null;

	@Index()
	@Column('integer', {
		comment: 'The ID of author.'
	})
	public userId: User['id'];

	@OneToOne(type => User, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public user: User | null;

	@Column('boolean', {
		default: false
	})
	public viaMobile: boolean;

	@Column('boolean', {
		default: false
	})
	public localOnly: boolean;

	@Column('integer', {
		default: 0
	})
	public renoteCount: number;

	@Column('integer', {
		default: 0
	})
	public repliesCount: number;

	@Column('jsonb', {
		default: {}
	})
	public reactionCounts: Record<string, number>;

	/**
	 * public ... 公開
	 * home ... ホームタイムライン(ユーザーページのタイムライン含む)のみに流す
	 * followers ... フォロワーのみ
	 * specified ... visibleUserIds で指定したユーザーのみ
	 */
	@Column('enum', { enum: ['public', 'home', 'followers', 'specified'] })
	public visibility: 'public' | 'home' | 'followers' | 'specified';

	@Index({ unique: true })
	@Column('varchar', {
		length: 256, nullable: true,
		comment: 'The URI of a note. it will be null when the note is local.'
	})
	public uri: string | null;

	@Column('integer', {
		default: 0
	})
	public score: number;

	@Column('integer', {
		array: true,
	})
	public fileIds: DriveFile['id'][];

	@Column('varchar', {
		length: 256, array: true,
	})
	public attachedFileTypes: string[];

	@Column('integer', {
		array: true,
	})
	public visibleUserIds: User['id'][];

	@Column('varchar', {
		length: 128, array: true,
	})
	public emojis: string[];

	@Column('jsonb', {
		default: {}, nullable: true
	})
	public poll: IPoll | null;

	//#region Denormalized fields
	@Column('varchar', {
		length: 128, nullable: true,
		comment: '[Denormalized]'
	})
	public userHost: string | null;

	@Column('varchar', {
		length: 128, nullable: true,
		comment: '[Denormalized]'
	})
	public userInbox: string | null;
	//#endregion
}

export type IPoll = {
	choices: IChoice[];
	multiple?: boolean;
	expiresAt?: Date;
};

export type IChoice = {
	id: number;
	text: string;
	votes: number;
};