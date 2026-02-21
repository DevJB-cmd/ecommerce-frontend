import { HttpClient } from '@angular/common/http';

export const API_BASE = 'http://localhost:8081';

export function entityUrl(entity: string): string {
  return `${API_BASE}/${entity}`;
}

export function idPath(id: number | string): string {
  return `/${id}`;
}
