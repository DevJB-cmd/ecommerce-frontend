import { Injectable } from '@angular/core';

export type PhotoEntity = 'product' | 'user' | 'provider' | 'client' | 'driver' | 'order';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private storageKey = 'entity_photo_store_v1';
  private photos: Record<string, string> = {};

  constructor() {
    this.photos = this.readStore();
  }

  get(entity: PhotoEntity, id: number | string | null | undefined): string | null {
    if (id === null || id === undefined) return null;
    return this.photos[this.key(entity, id)] || null;
  }

  set(entity: PhotoEntity, id: number | string | null | undefined, dataUrl: string): void {
    if (!dataUrl || id === null || id === undefined) return;
    this.photos[this.key(entity, id)] = dataUrl;
    this.writeStore();
  }

  remove(entity: PhotoEntity, id: number | string | null | undefined): void {
    if (id === null || id === undefined) return;
    delete this.photos[this.key(entity, id)];
    this.writeStore();
  }

  private key(entity: PhotoEntity, id: number | string): string {
    return `${entity}:${id}`;
  }

  private readStore(): Record<string, string> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {};
    }
  }

  private writeStore(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.photos));
    } catch {}
  }
}

