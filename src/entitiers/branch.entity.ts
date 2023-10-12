import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "name"})
  name: string;

  @Column("geometry", { spatialFeatureType: "Point", srid: 4326 })
  location: { type: "Point"; coordinates: number[] };

  @Column("text", { array: true })
  services: string[];

  @Column()
  load: number;
}
