import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AtmController } from './controllers/atm.controller';
import { OfficeController } from './controllers/office.controller';
import { Atm } from "./entitiers/atms";
import { Office } from "./entitiers/offices";

import { AtmService } from "./services/atm.service";
import { OfficeService } from "./services/office.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "195.26.31.103",
      //host: "localhost",
      port: 5432,
      username: "postgres",
      password: "LnDUbkuXpost",
      //password: "123",
      //database: "vtb-hack",
      database: "postgis_db",
      entities: [ Atm, Office],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Atm, Office]),
  ],
  controllers: [AppController, AtmController, OfficeController],
  providers: [AppService, AtmService, OfficeService],
})
export class AppModule {
}
