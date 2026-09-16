import { Injectable } from '@nestjs/common';
import { NotesService } from '../notes/notes.service.js';
import {
  DashboardData,
  handler as dashboardLambda,
} from '../lambda/dashboard.js';

@Injectable()
export class DashboardService {
  constructor(private readonly notesService: NotesService) {}

  async getMetrics(): Promise<DashboardData> {
    const notes = await this.notesService.findAll();

    const result = await dashboardLambda({
      notes,
    });

    return result;
  }
}
