import { HttpClient } from '@angular/common/http';

export const API_BASE = 'http://localhost:8081';

export function entityUrl(entity: string): string {
  // Map singular entity names to backend plural endpoints used by the Spring Boot API
  function pluralize(name: string): string {
    if (name.endsWith('s')) return name;
    if (name.endsWith('y')) return name.slice(0, -1) + 'ies'; // category -> categories
    return name + 's';
  }
  return `${API_BASE}/${pluralize(entity)}`;
}

export function idPath(id: number | string): string {
  return `/${id}`;
}
