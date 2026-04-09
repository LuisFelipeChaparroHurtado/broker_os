import {
  Component, ChangeDetectionStrategy, input, output,
  signal, computed, OnInit
} from '@angular/core';

export interface DayCell {
  num: number;
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isOtherMonth: boolean;
}

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [],
  templateUrl: './datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent implements OnInit {
  readonly value = input<string>('');

  readonly valueChange = output<string>();

  readonly currentMonth = signal(new Date());
  readonly selectedDate = signal('');

  ngOnInit(): void {
    if (this.value()) {
      this.selectedDate.set(this.value());
    }
  }

  readonly monthLabel = computed(() => {
    const d = this.currentMonth();
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  readonly days = computed((): DayCell[] => {
    const cm = this.currentMonth();
    const year = cm.getFullYear();
    const month = cm.getMonth();
    const today = new Date();
    const todayStr = this.toIso(today);
    const sel = this.selectedDate();

    const firstDay = new Date(year, month, 1);
    // Monday=0 ... Sunday=6
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: DayCell[] = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      cells.push({
        num: d.getDate(),
        date: d,
        isToday: this.toIso(d) === todayStr,
        isSelected: this.toIso(d) === sel,
        isOtherMonth: true,
      });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      cells.push({
        num: day,
        date: d,
        isToday: this.toIso(d) === todayStr,
        isSelected: this.toIso(d) === sel,
        isOtherMonth: false,
      });
    }

    // Next month padding (fill to complete 6 rows of 7)
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({
        num: i,
        date: d,
        isToday: this.toIso(d) === todayStr,
        isSelected: this.toIso(d) === sel,
        isOtherMonth: true,
      });
    }

    return cells;
  });

  prevMonth(): void {
    const cm = this.currentMonth();
    this.currentMonth.set(new Date(cm.getFullYear(), cm.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const cm = this.currentMonth();
    this.currentMonth.set(new Date(cm.getFullYear(), cm.getMonth() + 1, 1));
  }

  selectDay(day: DayCell): void {
    const iso = this.toIso(day.date);
    this.selectedDate.set(iso);
    this.valueChange.emit(iso);

    if (day.isOtherMonth) {
      this.currentMonth.set(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }
  }

  private toIso(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
