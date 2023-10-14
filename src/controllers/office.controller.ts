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

  @Post("search_in_box")
  async searchInBox(@Body("lat") lat: number, @Body("lng") lng: number, @Body("radius") radius: number) {
    try {
      return await this.officeService.searchInBox(
        lat,
        lng,
        radius * 1000,
      );
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
   @Post("search2")
  async searchOptimaBank2(@Body("lat") lat: number, @Body("lng") lng: number, @Body("radius") radius: number,
  @Body("rko") rko: string) {
    try {
      return await this.officeService.findOptimalOffice2(
        lat,
        lng,
        radius * 1000,
        rko,
      );
    } catch (error) {
      console.log(error);
      throw new Error("Unable to fetch branches.");
    }
  }


//    @Post("")
//   async searchOptimaBank(@Body("lat") lat: number, @Body("lng") lng: number, @Body("radius") radius: number) {
//     try {
//       return await this.officeService.findBranchesInRadius(
//         lat,
//         lng,
//         radius * 1000,
//       );
//     } catch (error) {
//       console.log(error);
//       throw new Error("Unable to fetch branches.");
//     }
//   }
}
