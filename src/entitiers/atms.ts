// atm.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Service } from './service';

@Entity()
export class Atm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column()
  allDay: boolean;

  @OneToMany(() => Service, service => service.atm)
  services: Service[];
}
