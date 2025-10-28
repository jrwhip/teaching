import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-plot-points',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './plot-points.component.html',
  styleUrls: ['./plot-points.component.scss']
})
export class PlotPointsComponent implements OnInit {
  pointA: number = 0;
  pointB: number = 0;
  userPlacedA: number | null = null;
  userPlacedB: number | null = null;
  distanceInput: string = '';
  feedback: string = '';
  feedbackColor: string = '';
  correctCount: number = 0;
  incorrectCount: number = 0;

  readonly start = -10;
  readonly end = 10;
  readonly step = 1;

  numberMarkers: number[] = [];

  ngOnInit(): void {
    this.generateNumberMarkers();
    this.generateNumberLineProblem();
  }

  generateNumberMarkers(): void {
    this.numberMarkers = [];
    for (let i = this.start; i <= this.end; i += this.step) {
      this.numberMarkers.push(i);
    }
  }

  generateNumberLineProblem(): void {
    // Randomly select two distinct points
    do {
      this.pointA = Math.floor(Math.random() * (this.end - this.start + 1)) + this.start;
      this.pointB = Math.floor(Math.random() * (this.end - this.start + 1)) + this.start;
    } while (this.pointA === this.pointB);

    // Clear feedback and input
    this.feedback = '';
    this.distanceInput = '';

    // Reset user placements
    this.userPlacedA = null;
    this.userPlacedB = null;
  }

  getMarkerPosition(value: number): string {
    return `${((value - this.start) / (this.end - this.start)) * 100}%`;
  }

  placeMarker(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const containerWidth = rect.width;

    // Calculate the clicked value on the number line
    const value = Math.round(((clickPosition / containerWidth) * (this.end - this.start)) + this.start);

    // Check if clicking on an existing marker
    if (this.userPlacedA === value) {
      this.userPlacedA = null;
      return;
    }
    if (this.userPlacedB === value) {
      this.userPlacedB = null;
      return;
    }

    // Place new markers if not already set
    if (this.userPlacedA === null) {
      this.userPlacedA = value;
    } else if (this.userPlacedB === null) {
      this.userPlacedB = value;
    }
  }

  removeMarker(marker: 'A' | 'B', event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering the number line click
    if (marker === 'A') {
      this.userPlacedA = null;
    } else {
      this.userPlacedB = null;
    }
  }

  checkAnswer(): void {
    const correctDistance = Math.abs(this.pointA - this.pointB);

    // Check if both markers are placed correctly
    if (this.userPlacedA === null || this.userPlacedB === null) {
      this.feedback = 'Please place both markers on the number line.';
      this.feedbackColor = 'red';
      return;
    }

    // Ensure the order of points is correct (pointA and pointB are interchangeable)
    const correctPoints = [this.pointA, this.pointB].sort();
    const userPoints = [this.userPlacedA, this.userPlacedB].sort();

    if (JSON.stringify(correctPoints) !== JSON.stringify(userPoints)) {
      this.feedback = `Incorrect marker placement. Place markers at ${this.pointA} and ${this.pointB}.`;
      this.feedbackColor = 'red';
      this.incorrectCount++;
      return;
    }

    // Check distance answer
    const userDistance = parseInt(this.distanceInput.trim());
    if (userDistance === correctDistance) {
      this.feedback = 'Correct!';
      this.feedbackColor = 'green';
      this.correctCount++;

      // Generate new problem after 1 second delay
      setTimeout(() => this.generateNumberLineProblem(), 1000);
    } else {
      this.feedback = `Incorrect. The correct distance is ${correctDistance}.`;
      this.feedbackColor = 'red';
      this.incorrectCount++;
    }
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.checkAnswer();
    }
  }
}
