import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  imports: [],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.css',
})
export class Placeholder {
  private readonly route = inject(ActivatedRoute);
  readonly entidad = this.route.snapshot.data['entidad'] || 'Entidad';
  readonly responsable = this.route.snapshot.data['responsable'] || 'Compañero';
}
