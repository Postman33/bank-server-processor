import { Column, Entity, Point, PrimaryGeneratedColumn } from "typeorm";
// TODO: Open Hours
// TODO: Check other fields

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  salePointName: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  rko: string;

  @Column({ nullable: true })
  officeType: string;

  @Column({ nullable: true })
  salePointFormat: string;

  @Column({ nullable: true })
  suoAvailability: boolean;

  @Column({ nullable: true })
  hasRamp: boolean;

  @Column({ type: 'geometry', nullable: true })
  location: Point;

  @Column({ nullable: true })
  metroStation: string;

  @Column({ nullable: true })
  distance: number;

  @Column({ nullable: true })
  kep: boolean;

  @Column({ nullable: true })
  myBranch: boolean;


  @Column({ nullable: true, type: 'double precision' })
  loadFactor: number;


}