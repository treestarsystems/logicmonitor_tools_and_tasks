import { Test, TestingModule } from '@nestjs/testing';
import { ToolsController } from '../src/tools/tools.controller';

describe('ToolsController', () => {
  let controller: ToolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolsController],
    }).compile();

    controller = module.get<ToolsController>(ToolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
