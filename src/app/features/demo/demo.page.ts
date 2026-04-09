import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// Forms
import { FormFieldComponent } from '../../shared/components/forms/form-field/form-field.component';
import { InputComponent } from '../../shared/components/forms/input/input.component';
import { TextareaComponent } from '../../shared/components/forms/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../../shared/components/forms/select/select.component';
import { CheckboxComponent } from '../../shared/components/forms/checkbox/checkbox.component';
import { RadioGroupComponent, RadioOption } from '../../shared/components/forms/radio-group/radio-group.component';
import { SwitchComponent } from '../../shared/components/forms/switch/switch.component';
import { SliderComponent } from '../../shared/components/forms/slider/slider.component';
import { MultiSelectComponent, MultiSelectOption } from '../../shared/components/forms/multi-select/multi-select.component';
import { AutocompleteComponent, AutocompleteItem } from '../../shared/components/forms/autocomplete/autocomplete.component';
import { DatepickerComponent } from '../../shared/components/forms/datepicker/datepicker.component';
import { FileUploadComponent } from '../../shared/components/forms/file-upload/file-upload.component';

// Actions
import { BtnComponent } from '../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../shared/components/actions/link/link.component';
import { MenuComponent, MenuItem } from '../../shared/components/actions/menu/menu.component';

// Navigation
import { NavbarComponent } from '../../shared/components/navigation/navbar/navbar.component';
import { TabsComponent } from '../../shared/components/navigation/tabs/tabs.component';
import { BreadcrumbsComponent } from '../../shared/components/navigation/breadcrumbs/breadcrumbs.component';
import { PaginationComponent } from '../../shared/components/navigation/pagination/pagination.component';
import { StepperComponent } from '../../shared/components/navigation/stepper/stepper.component';

// Feedback
import { AlertComponent } from '../../shared/components/feedback/alert/alert.component';
import { ToastService } from '../../shared/components/feedback/toast/toast.service';
import { ModalService } from '../../shared/components/feedback/modal/modal.service';
import { ProgressBarComponent } from '../../shared/components/feedback/progress-bar/progress-bar.component';
import { SkeletonComponent } from '../../shared/components/feedback/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/feedback/empty-state/empty-state.component';
import { PopoverComponent } from '../../shared/components/feedback/popover/popover.component';
import { TooltipComponent } from '../../shared/components/feedback/tooltip/tooltip.component';

// Data Display
import { DataTableComponent } from '../../shared/components/data-display/data-table/data-table.component';
import { TableConfig } from '../../shared/components/data-display/data-table/data-table.models';
import { CardComponent } from '../../shared/components/data-display/card/card.component';
import { ListComponent, ListItem } from '../../shared/components/data-display/list/list.component';
import { AccordionComponent, AccordionItem } from '../../shared/components/data-display/accordion/accordion.component';
import { ChartWrapperComponent } from '../../shared/components/data-display/chart-wrapper/chart-wrapper.component';
import { TagComponent } from '../../shared/components/data-display/tag/tag.component';
import { BadgeComponent } from '../../shared/components/data-display/badge/badge.component';

interface TradeRow {
  id: string; symbol: string; side: string; price: string; pnl: string; pnlPct: string; status: string;
}

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BtnComponent, FormFieldComponent, InputComponent, TextareaComponent,
    SelectComponent, CheckboxComponent, RadioGroupComponent, SwitchComponent,
    MenuComponent, PaginationComponent, AlertComponent, ProgressBarComponent,
    SkeletonComponent, EmptyStateComponent, DataTableComponent, BadgeComponent, TagComponent,
    SliderComponent, TabsComponent, BreadcrumbsComponent, StepperComponent, NavbarComponent,
    CardComponent, ListComponent, AccordionComponent, LinkComponent, PopoverComponent,
    TooltipComponent, ChartWrapperComponent, MultiSelectComponent, AutocompleteComponent,
    DatepickerComponent, FileUploadComponent,
  ],
  templateUrl: './demo.page.html',
  styleUrl: './demo.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly toast = inject(ToastService);
  readonly modal = inject(ModalService);

  // ── Form ────────────────────────────
  readonly form = this.fb.group({
    symbol: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0.001)]],
    notes: [''],
    orderType: ['MARKET'],
    notify: [true],
  });

  // ── Select options ──────────────────
  readonly symbolOptions: SelectOption[] = [
    { value: 'BTCUSD', label: 'BTC / USD' },
    { value: 'ETHUSD', label: 'ETH / USD' },
    { value: 'EURUSD', label: 'EUR / USD' },
    { value: 'XAUUSD', label: 'XAU / USD' },
    { value: 'SOLUSD', label: 'SOL / USD' },
  ];

  readonly radioOptions: RadioOption[] = [
    { value: 'MARKET', label: 'Market' },
    { value: 'LIMIT', label: 'Límite' },
    { value: 'STOP', label: 'Stop Loss' },
  ];

  // ── Multi-select options ─────────────
  readonly multiOptions: MultiSelectOption[] = [
    { value: 'BTC', label: 'BTC' },
    { value: 'ETH', label: 'ETH' },
    { value: 'SOL', label: 'SOL' },
    { value: 'EUR', label: 'EUR/USD' },
    { value: 'XAU', label: 'XAU/USD' },
  ];

  // ── Autocomplete suggestions ─────────
  readonly autoSuggestions: AutocompleteItem[] = [
    { label: 'BTC / USD', sub: '$98,420.00' },
    { label: 'BTC / EUR', sub: '€90,350.00' },
    { label: 'ETH / USD', sub: '$3,841.00' },
    { label: 'EUR / USD', sub: '$1.0842' },
    { label: 'SOL / USD', sub: '$185.40' },
  ];

  // ── Menu ─────────────────────────────
  readonly menuItems: MenuItem[] = [
    { label: 'Nueva orden', icon: '+', action: 'new' },
    { label: 'Ver posiciones', icon: '→', action: 'positions' },
    { label: 'Terminal activo', icon: '■', action: 'terminal' },
    { divider: true, label: '' },
    { label: 'Cerrar posición', icon: '−', action: 'close', danger: true },
  ];

  // ── Pagination ───────────────────────
  readonly currentPage = signal(0);

  // ── Slider ──────────────────────────
  readonly sliderValue = signal(65);
  readonly leverageValue = signal(10);

  // ── Tabs ─────────────────────────────
  readonly lineTabs = [
    { label: 'Posiciones', key: 'positions', badge: '4' },
    { label: 'Órdenes', key: 'orders' },
    { label: 'Historial', key: 'history' },
    { label: 'Alertas', key: 'alerts', badge: '2' },
  ];
  readonly pillTabs = [
    { label: '1D', key: '1d' },
    { label: '1S', key: '1s' },
    { label: '1M', key: '1m' },
    { label: '1A', key: '1a' },
  ];

  // ── Breadcrumbs ──────────────────────
  readonly breadcrumbs = [
    { label: 'Broker OS' },
    { label: 'Portfolio' },
    { label: 'Crypto' },
    { label: 'BTC/USD' },
  ];

  // ── Stepper ──────────────────────────
  readonly steps = [
    { label: 'Cuenta' },
    { label: 'Verificación' },
    { label: 'Depósito' },
    { label: 'Confirmar' },
  ];

  // ── Navbar ──────────────────────────
  readonly navItems = [
    { label: 'Terminal', key: 'terminal', active: true },
    { label: 'Portfolio', key: 'portfolio' },
    { label: 'Órdenes', key: 'orders' },
    { label: 'Reportes', key: 'reports' },
  ];

  // ── List ─────────────────────────────
  readonly listItems: ListItem[] = [
    { avatar: '₿', name: 'BTC / USD', sub: 'Long · 0.25 BTC', value: '+$585', valueClass: 'ds-td-positive' },
    { avatar: 'Ξ', name: 'ETH / USD', sub: 'Short · 2.0 ETH', value: '+$118', valueClass: 'ds-td-positive' },
    { avatar: '€', name: 'EUR / USD', sub: 'Long · 5,000', value: '−$90', valueClass: 'ds-td-negative' },
    { avatar: 'Au', name: 'XAU / USD', sub: 'Long · 1 oz', value: '−$280', valueClass: 'ds-td-negative' },
  ];

  // ── Accordion ────────────────────────
  readonly accordionItems: AccordionItem[] = [
    { title: 'Configuración de riesgo', content: 'Stop Loss máximo por operación: 2% del capital. Drawdown diario límite: 5%. Apalancamiento máximo permitido: 10x en crypto, 50x en Forex.' },
    { title: 'APIs conectadas', content: 'Interactive Brokers API v2 · Saxo Capital Markets · Binance (configuración pendiente)' },
    { title: 'Notificaciones y alertas', content: 'Email para ejecuciones. Push para stop-loss activados. SMS solo para errores críticos.' },
    { title: 'Historial de acceso', content: 'Último acceso: 09/04/2026 14:28 · Madrid, ES · Chrome 123. Sesiones activas: 1' },
  ];

  // ── Tags ─────────────────────────────
  readonly tags = signal(['BTC', 'ETH', 'EUR/USD', 'Crypto']);

  removeTag(tag: string): void {
    this.tags.update(t => t.filter(x => x !== tag));
  }

  // ── Data Table ───────────────────────
  readonly tableConfig: TableConfig<TradeRow> = {
    trackBy: 'id',
    emptyTitle: 'Sin posiciones abiertas',
    emptyMessage: 'Aún no tienes operaciones activas.',
    columns: [
      { key: 'symbol', header: 'Instrumento', sortable: true },
      { key: 'side', header: 'Tipo', type: 'badge-buy' },
      { key: 'price', header: 'Precio entrada', type: 'mono', align: 'right' },
      { key: 'pnl', header: 'P&L', type: 'positive', align: 'right' },
      { key: 'pnlPct', header: '%', type: 'positive', align: 'right' },
      { key: 'status', header: 'Estado', type: 'badge-active' },
    ],
    rowActions: [
      { action: 'view', label: 'Ver detalle', icon: '👁' },
      { action: 'cancel', label: 'Cerrar posición', icon: '✕', danger: true },
    ],
  };

  readonly tableData: TradeRow[] = [
    { id: '1', symbol: 'BTC/USD', side: 'BUY', price: '$96,080', pnl: '+$585', pnlPct: '+2.44%', status: 'ACTIVA' },
    { id: '2', symbol: 'ETH/USD', side: 'SELL', price: '$3,900', pnl: '+$118', pnlPct: '+1.51%', status: 'ACTIVA' },
    { id: '3', symbol: 'EUR/USD', side: 'BUY', price: '$1.0860', pnl: '−$90', pnlPct: '−0.17%', status: 'PEND.' },
    { id: '4', symbol: 'XAU/USD', side: 'BUY', price: '$3,000', pnl: '−$280', pnlPct: '−0.93%', status: 'ACTIVA' },
  ];

  // ── Actions ─────────────────────────
  onMenuAction(action: string): void {
    this.toast.info('Acción', `Acción: ${action}`);
  }

  async onDelete(): Promise<void> {
    const confirmed = await this.modal.confirm({
      title: '⚠ Liquidar posición',
      message: 'Esta acción cerrará tu posición completa a precio de mercado. No se puede deshacer.',
      confirmLabel: 'Liquidar posición',
      cancelLabel: 'No, mantener',
      danger: true,
    });
    if (confirmed) this.toast.success('Posición liquidada', 'BTC/USD cerrado a mercado');
  }

  onTableAction(e: { action: string; row: TradeRow }): void {
    if (e.action === 'cancel') {
      this.onDelete();
    } else {
      this.toast.mint('Detalle', `Trade: ${e.row.symbol}`);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.toast.success('Orden ejecutada', `${this.form.value.symbol} · ${this.form.value.quantity} BTC`);
    } else {
      this.toast.error('Formulario inválido', 'Revisa los campos requeridos');
    }
  }
}
