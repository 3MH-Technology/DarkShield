import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild, AfterViewInit } from '@angular/core';

// This is a simplified version of Chart.js types for this component
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  indexAxis?: 'x' | 'y';
  // Add other Chart.js options as needed
}

declare var Chart: any; // Using 'any' for Chart.js constructor for simplicity in this context

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<canvas #chartCanvas></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit {
  chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  
  type = input.required<'line' | 'bar' | 'pie' | 'doughnut'>();
  data = input.required<ChartData>();
  options = input<ChartOptions>({});

  private chart: any;

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    
    const context = this.chartCanvas().nativeElement.getContext('2d');
    if (context) {
      this.chart = new Chart(context, {
        type: this.type(),
        data: this.data(),
        options: this.options(),
      });
    }
  }
}
