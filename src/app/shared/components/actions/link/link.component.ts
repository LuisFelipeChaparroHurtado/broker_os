import {
  Component, ChangeDetectionStrategy, input
} from '@angular/core';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [],
  templateUrl: './link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  readonly href     = input<string>('#');
  readonly variant  = input<'default' | 'muted'>('default');
  readonly external = input<boolean>(false);
}
