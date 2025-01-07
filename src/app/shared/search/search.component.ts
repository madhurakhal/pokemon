import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements AfterViewInit {
  @Input() label = 'Search';
  @Input() throttle = 300;
  @Output() searchChange: EventEmitter<string> = new EventEmitter();
  @ViewChild("search", { static: true }) search!: ElementRef;


  destroyRef = inject(DestroyRef)

  filters = {
    search: "",
  };


  handleEnter(evt: Event): void {
    evt.preventDefault();
    this.searchChange.emit(this.filters.search);
  }

  ngAfterViewInit(): void {
    const eventStream = fromEvent(this.search.nativeElement, "input").pipe(
      map(() => this.filters.search),
      debounceTime(this.throttle),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    );

    eventStream.subscribe(() => {
      this.searchChange.emit(this.filters.search);
    });
  }
}
