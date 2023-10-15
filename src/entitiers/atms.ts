// atm.entity.ts
import { Column, Entity, Point, PrimaryGeneratedColumn } from "typeorm";

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
