import { Body, Controller, Post } from "@nestjs/common";
import { AtmService } from "../services/atm/atm.service";

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

  @Post('find_optima_atm')
  async searchOptimaBank(@Body('lat') lat: number, @Body('lng') lng: number, @Body('radius') radius: number) {
    console.log("start search optima")
    try {
      return await this.atmService.findOptima(
        lat,
        lng,
        radius*1000,
      );
    } catch (error) {
      console.log(error);
      throw new Error('Unable to fetch branches.');
    }
  }

}
