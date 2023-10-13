// atm.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Point } from "typeorm";

@Entity()
export class Atm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;


  @Column({ type: 'geometry', nullable: true })
  location: Point;

  @Column()
  allDay: boolean;

  @Column('json')
  services: string;
}
