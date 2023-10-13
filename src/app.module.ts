import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BanksController } from "./controllers/banks/banks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch } from "./entitiers/branch.entity";
import { BranchService } from './services/branch/branch.service';
import { AtmController } from './controllers/atm/atm.controller';
import { OfficeController } from './controllers/office/office.controller';
import { Atm } from "./entitiers/atms";
import { Office } from "./entitiers/offices";
import { Service } from "./entitiers/service";
import { AtmService } from "./services/atm/atm.service";
import { OfficeService } from "./services/office/office.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      //host: "195.26.31.103",
      host: "localhost",
      port: 5432,
      username: "postgres",
      //password: "LnDUbkuXpost",
      password: "123",
      database: "vtb-hack",
      entities: [Branch, Atm, Office, Service],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Branch,Atm, Office, Service]),
  ],
  controllers: [AppController, BanksController, AtmController, OfficeController],
  providers: [AppService, BranchService, AtmService, OfficeService],
})
export class AppModule {
}
