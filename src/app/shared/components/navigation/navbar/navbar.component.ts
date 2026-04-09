import {
  Component, ChangeDetectionStrategy, input, output
} from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly brand = input<string>('');
  readonly items = input<{ label: string; key: string; active?: boolean }[]>([]);

  readonly navClick = output<string>();

  onNav(key: string): void {
    this.navClick.emit(key);
  }
}
