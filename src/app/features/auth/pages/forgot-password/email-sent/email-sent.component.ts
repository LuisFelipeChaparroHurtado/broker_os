import {
  Component, ChangeDetectionStrategy, DestroyRef, computed,
  inject, input, output, signal,
} from '@angular/core';

import { BtnComponent } from '../../../../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../../../../shared/components/actions/link/link.component';

const RESEND_COOLDOWN_SECONDS = 45;

@Component({
  selector: 'app-email-sent',
  standalone: true,
  imports: [BtnComponent, LinkComponent],
  templateUrl: './email-sent.component.html',
  styleUrl: './email-sent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailSentComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly email = input.required<string>();

  readonly resend    = output<void>();
  readonly back      = output<void>();
  readonly haveCode  = output<void>();

  private readonly _remaining = signal<number>(RESEND_COOLDOWN_SECONDS);
  readonly remaining = this._remaining.asReadonly();

  readonly canResend = computed((): boolean => this._remaining() === 0);

  readonly countdownText = computed((): string => {
    const s = this._remaining();
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `Disponible en ${mm}:${ss < 10 ? '0' : ''}${ss}`;
  });

  readonly maskedEmail = computed((): string => {
    const value = this.email();
    const [name, domain] = value.split('@');
    if (!domain) return value;
    const visible = name.slice(0, 2);
    return `${visible}****@${domain}`;
  });

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearInterval());
    this.startCountdown();
  }

  onResend(): void {
    if (!this.canResend()) return;
    this.resend.emit();
    this.startCountdown();
  }

  private startCountdown(): void {
    this.clearInterval();
    this._remaining.set(RESEND_COOLDOWN_SECONDS);
    this.intervalId = setInterval(() => {
      const value = this._remaining();
      if (value <= 1) {
        this._remaining.set(0);
        this.clearInterval();
      } else {
        this._remaining.set(value - 1);
      }
    }, 1000);
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
