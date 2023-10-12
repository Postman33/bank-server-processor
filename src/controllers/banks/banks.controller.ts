import { Body, Controller, Post } from "@nestjs/common";
import { BranchService } from "../../services/branch/branch.service";
import { Branch } from "../../entitiers/branch.entity";

@Controller('banks')
export class BanksController {
  constructor(private branchService: BranchService) {
  }


  @Post('search')
  async searchBranches(@Body('services') services: string[]) {
    try {
      const branches: Branch[] =
        await this.branchService.findBranchesByServices(services);
      console.log(branches);
    } catch (error) {
      throw new Error('Unable to fetch branches.');
    }
  }

  @Post('search_radius')
  async searchBranchesRadius(@Body('lat') lat: number, @Body('lng') lng: number, @Body('radius') radius: number) {
    try {
      return await this.branchService.findBranchesInRadius(
        lat,
        lng,
        radius,
      );
    } catch (error) {
      throw new Error('Unable to fetch branches.');
    }
  }


}
