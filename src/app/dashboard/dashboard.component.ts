import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  registerables // Import registerables from Chart.js
} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('temperatureChartCanvas', { static: true }) temperatureChartCanvas!: ElementRef;
  @ViewChild('humidityChartCanvas', { static: true }) humidityChartCanvas!: ElementRef;
  @ViewChild('windChartCanvas', { static: true }) windChartCanvas!: ElementRef;

  weatherData: any[] = [];

  constructor(private http: HttpClient) {
    // Register all required Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadWeatherData();
  }

  loadWeatherData(): void {
    this.http.get<any[]>('/assets/weather_data.json').subscribe(data => {
      console.log('Weather Data:', data);
      this.weatherData = data;
      this.createTemperatureChart();
      this.createHumidityChart();
      this.createWindChart();
    });
  }

  createTemperatureChart(): void {
    console.log('Creating Temperature Chart'); // Debugging log
    const ctx = this.temperatureChartCanvas.nativeElement.getContext('2d');

    const labels = this.weatherData.map(item => item.City);
    const temperatures = this.weatherData.map(item => item['Temperature (°C)']);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatures,
            backgroundColor: 'rgba(255, 182, 193, 0.7)', // Light pink
            borderColor: 'rgba(255, 105, 180, 1)', // Hot pink
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createHumidityChart(): void {
    console.log('Creating Humidity Chart'); // Debugging log
    const ctx = this.humidityChartCanvas.nativeElement.getContext('2d');

    const labels = this.weatherData.map(item => item.City);
    const humidity = this.weatherData.map(item => item['Humidity (%)']);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Humidity (%)',
            data: humidity,
            backgroundColor: [
              'rgba(255, 182, 193, 0.7)', // Light pink
              'rgba(255, 160, 122, 0.7)', // Salmon pink
              'rgba(255, 192, 203, 0.7)', // Baby pink
              'rgba(255, 105, 180, 0.7)', // Hot pink
              'rgba(255, 228, 225, 0.7)', // Misty rose
            ],
            borderColor: 'rgba(255, 105, 180, 1)', // Hot pink
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  createWindChart(): void {
    console.log('Creating Temperature Chart'); // Debugging log
    const ctx = this.windChartCanvas.nativeElement.getContext('2d');

    const labels = this.weatherData.map(item => item.City);
    const windSpeeds = this.weatherData.map(item => item['Wind Speed (m/s)']);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Wind Speed (m/s)',
            data: windSpeeds,
            borderColor: 'rgba(255, 105, 180, 1)', // Hot pink
          backgroundColor: 'rgba(255, 182, 193, 0.3)', // Transparent pink
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
