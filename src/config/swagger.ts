import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ISP Data Importer')
  .setDescription('This application integrates data from a fictitious network management system with OZmap.')
  .build();
