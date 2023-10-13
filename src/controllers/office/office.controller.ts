import { Controller, Post } from "@nestjs/common";
import { AtmService } from "../../services/atm/atm.service";
import { OfficeService } from "../../services/office/office.service";

@Controller('office')
export class OfficeController {
  constructor(private officeService: OfficeService) {
  }

  @Post('add')
  async searchBranches() {
    try {
      await this.officeService.addOfficesFromFile();
    } catch (error) {
      console.log(error);

      throw new Error('Unable to fetch branches.');
    }
  }

}
