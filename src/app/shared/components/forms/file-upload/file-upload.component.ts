import {
  Component, ChangeDetectionStrategy, input, output,
  signal
} from '@angular/core';

export interface FileItem {
  name: string;
  size: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  readonly accept    = input<string>('*');
  readonly maxSizeMb = input<number>(10);
  readonly multiple  = input<boolean>(false);

  readonly filesChange = output<File[]>();

  readonly files    = signal<FileItem[]>([]);
  readonly dragOver = signal(false);

  private rawFiles: File[] = [];

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragOver.set(false);
    if (e.dataTransfer?.files) {
      this.processFiles(Array.from(e.dataTransfer.files));
    }
  }

  onFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
    }
    input.value = '';
  }

  private processFiles(incoming: File[]): void {
    const maxBytes = this.maxSizeMb() * 1024 * 1024;
    const valid = incoming.filter(f => f.size <= maxBytes);

    if (this.multiple()) {
      this.rawFiles = [...this.rawFiles, ...valid];
    } else {
      this.rawFiles = valid.length ? [valid[0]] : [];
    }

    this.files.set(this.rawFiles.map(f => ({
      name: f.name,
      size: this.formatSize(f.size),
    })));

    this.filesChange.emit([...this.rawFiles]);
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
