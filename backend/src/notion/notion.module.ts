import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { NotionController } from './notion.controller';

@Module({
  providers: [NotionService],
  controllers: [NotionController],
  exports: [NotionService], // 다른 모듈에서 사용 가능하도록 export
})
export class NotionModule {}
