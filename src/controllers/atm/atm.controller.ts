import { Controller, Post } from "@nestjs/common";
import { AtmService } from "../../services/atm/atm.service";

@Controller('atm')
export class AtmController {
  constructor(private atmService: AtmService) {
  }

  @Post('add')
  async searchBranches() {
    try {
        await this.atmService.addDataFromJson();
    } catch (error) {
      console.log(error);

      throw new Error('Unable to fetch branches.');
    }
  }

}
