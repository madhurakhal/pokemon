import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  @Input() label = 'Select'
  @Input() options: string[] = []
  value: string = '';
  @Output() valueChanged = new EventEmitter<string>()

  handleModelhanged() {
    this.valueChanged.emit(this.value)
  }
}
