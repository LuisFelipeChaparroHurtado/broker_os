import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-brand-panel',
  standalone: true,
  templateUrl: './brand-panel.component.html',
  styleUrl: './brand-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandPanelComponent {}
