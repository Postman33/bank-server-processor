
// service.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Atm } from './atms';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column()
  serviceCapability: string;

  @Column()
  serviceActivity: string;

  @ManyToOne(() => Atm, atm => atm.services)
  atm: Atm;
}