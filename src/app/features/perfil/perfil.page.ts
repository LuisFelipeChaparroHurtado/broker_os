import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { SeguridadComponent } from './components/seguridad/seguridad.component';
import { DatosFinancierosComponent } from './components/datos-financieros/datos-financieros.component';
import { PreferenciasComponent } from './components/preferencias/preferencias.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { DocumentosComponent } from './components/documentos/documentos.component';

interface PerfilTab {
  key: string;
  label: string;
}

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [DatosPersonalesComponent, SeguridadComponent, DatosFinancierosComponent, PreferenciasComponent, SolicitudesComponent, DocumentosComponent],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilPageComponent {
  readonly eyebrow = 'Mi cuenta';
  readonly title = 'Perfil';
  readonly subtitle = 'Gestiona tu información personal, seguridad y preferencias de la cuenta.';

  readonly activeTab = signal<string>('datos-personales');

  readonly tabs: readonly PerfilTab[] = [
    { key: 'datos-personales',  label: 'Datos Personales'  },
    { key: 'verificacion-kyc',  label: 'Verificación KYC'  },
    { key: 'seguridad',         label: 'Seguridad'         },
    { key: 'datos-financieros', label: 'Datos Financieros' },
    { key: 'preferencias',      label: 'Preferencias'      },
    { key: 'solicitudes',       label: 'Solicitudes'       },
    { key: 'documentos',        label: 'Documentos'        },
  ];

  setTab(key: string): void {
    this.activeTab.set(key);
  }
}
