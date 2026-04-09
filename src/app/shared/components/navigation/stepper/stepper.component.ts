import {
  Component, ChangeDetectionStrategy, input, output
} from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [],
  templateUrl: './stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  readonly steps      = input<{ label: string }[]>([]);
  readonly activeStep = input<number>(0);

  readonly stepChange = output<number>();
}
