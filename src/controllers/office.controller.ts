import { Body, Controller, Post } from "@nestjs/common";
import { OfficeService } from "../services/office/office.service";

@Controller("office")
export class OfficeController {
  constructor(private officeService: OfficeService) {
  }

  @Post("add")
  async searchBranches() {
    try {
      await this.officeService.addOfficesFromFile();
    } catch (error) {
      console.log(error);

      throw new Error("Unable to fetch branches.");
    }
  }

  @Post("search")
  async searchOptimaBank(@Body("lat") lat: number, @Body("lng") lng: number, @Body("radius") radius: number) {
    try {
      return await this.officeService.findOptimalOffice(
        lat,
        lng,
        radius * 1000,
      );
    } catch (error) {
      console.log(error);
      throw new Error("Unable to fetch branches.");
    }
  }


}
