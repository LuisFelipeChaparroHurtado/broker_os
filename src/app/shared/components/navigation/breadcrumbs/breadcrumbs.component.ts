import {
  Component, ChangeDetectionStrategy, input, output
} from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  readonly items = input<{ label: string; link?: string }[]>([]);

  readonly navigate = output<string>();

  onClick(link?: string): void {
    if (link) this.navigate.emit(link);
  }
}
