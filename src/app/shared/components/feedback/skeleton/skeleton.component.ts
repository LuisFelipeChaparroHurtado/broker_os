import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type SkeletonType = 'text' | 'circle' | 'rect' | 'table' | 'card';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly type   = input<SkeletonType>('text');
  readonly rows   = input<number>(3);
  readonly width  = input<string>('100%');
  readonly height = input<string>('16px');

  readonly rowArray = computed(() =>
    Array.from({ length: this.rows() })
  );
}
