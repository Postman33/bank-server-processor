import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BanksController } from "./controllers/banks/banks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch } from "./entitiers/branch.entity";
import { BranchService } from './services/branch/branch.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "195.26.31.103",
      port: 5432,
      username: "postgres",
      password: "LnDUbkuXpost",
      database: "postgis_db",
      entities: [Branch],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Branch]),
  ],
  controllers: [AppController, BanksController],
  providers: [AppService, BranchService],
})
export class AppModule {
}
