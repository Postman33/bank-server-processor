import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../../entitiers/branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async findBranchesByServices(services: string[]): Promise<Branch[]> {
    return this.branchRepository
      .createQueryBuilder('branch')
      //.where('branch.services @> :services', { services })
      .select([
        'branch.id',
        'branch.name',
        'branch.location',
        'branch.services',
        'branch.load',
      ])
      .getMany();
  }

  async findBranchesInRadius(
    lat: number,
    lng: number,
    radius: number,
  ): Promise<Branch[]> {
    return this.branchRepository
      .createQueryBuilder("branch")
      .select([
        'branch.id',
        'branch.name',
        'branch.location',
        'branch.services',
        'branch.load',
      ])
      .where(
        `ST_DWithin(
          branch.location, 
          ST_MakePoint(:lng, :lat)::geography, 
          :radius
        )`,
        { lat, lng, radius },
      )
      .getMany();
  }
}
