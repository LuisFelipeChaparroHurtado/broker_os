import { Component, ChangeDetectionStrategy, input, output, signal, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { BtnComponent } from '../../../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../../../shared/components/actions/link/link.component';
import { AlertComponent } from '../../../../shared/components/feedback/alert/alert.component';

@Component({
  selector: 'app-tfa-form',
  standalone: true,
  imports: [BtnComponent, LinkComponent, AlertComponent],
  templateUrl: './tfa-form.component.html',
  styleUrl: './tfa-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TfaFormComponent implements AfterViewInit {
  readonly isLoading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitCode = output<string>();
  readonly backToLogin = output<void>();
  readonly resendCode = output<void>();

  readonly digits = signal<string[]>(['', '', '', '', '', '']);
  readonly countdown = signal(30);
  readonly canResend = signal(false);
  readonly shaking = signal(false);

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private timer: ReturnType<typeof setInterval> | null = null;

  ngAfterViewInit(): void {
    this.startCountdown();
    setTimeout(() => this.codeInputs.first?.nativeElement.focus(), 100);
  }

  onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    this.digits.update(d => {
      const next = [...d];
      next[index] = value.charAt(0) || '';
      return next;
    });

    if (value && index < 5) {
      const inputs = this.codeInputs.toArray();
      inputs[index + 1]?.nativeElement.focus();
    }

    const code = this.digits().join('');
    if (code.length === 6) {
      this.submitCode.emit(code);
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      const inputs = this.codeInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      this.digits.set(pasted.split(''));
      this.submitCode.emit(pasted);
    }
  }

  get allFilled(): boolean {
    return this.digits().every(d => d !== '');
  }

  private startCountdown(): void {
    this.countdown.set(30);
    this.canResend.set(false);
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.countdown.update(v => v - 1);
      if (this.countdown() <= 0) {
        this.canResend.set(true);
        if (this.timer) clearInterval(this.timer);
      }
    }, 1000);
  }

  onResend(): void {
    this.resendCode.emit();
    this.startCountdown();
    this.digits.set(['', '', '', '', '', '']);
  }
}
