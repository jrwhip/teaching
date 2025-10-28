import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';

type CircleType = 'open' | 'closed';
type Direction = 'left' | 'right';
type InequalitySymbol = '>' | '≥' | '<' | '≤';

@Component({
  selector: 'app-inequality',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './inequality.component.html',
  styleUrls: ['./inequality.component.scss']
})
export class InequalityComponent implements OnInit, AfterViewInit {
  @ViewChild('numberLineContainer', { static: false }) numberLineContainer!: ElementRef<HTMLDivElement>;

  title: string = 'Graph the Inequality';
  message: string = '';
  errorMessage: string = '';
  correctCount: number = 0;
  incorrectCount: number = 0;

  circleType: CircleType = 'open';
  direction: Direction | null = null;
  circleChosen: boolean = false;
  directionChosen: boolean = false;

  targetValue: number = 0;
  inequality: InequalitySymbol = '>';
  markerPosition: number | null = null;

  step: number = 0;
  readonly tickCount = 21; // For a number line from -10 to 10
  ticks: number[] = [];

  // Visual elements
  markerLeft: string = '0px';
  showMarker: boolean = false;
  isMarkerOpen: boolean = true;

  lineLeft: string = '0px';
  lineWidth: string = '0px';
  showLine: boolean = false;

  arrowLeft: string = '0px';
  showArrow: boolean = false;
  isArrowRight: boolean = true;

  ngOnInit(): void {
    this.generateTicks();
  }

  ngAfterViewInit(): void {
    // Wait for view to initialize before calculating step
    setTimeout(() => {
      this.calculateStep();
      this.generateProblem();
    });
  }

  generateTicks(): void {
    this.ticks = [];
    for (let i = 0; i < this.tickCount; i++) {
      this.ticks.push(i - 10); // Numbers from -10 to 10
    }
  }

  calculateStep(): void {
    const containerWidth = this.numberLineContainer.nativeElement.offsetWidth;
    this.step = containerWidth / (this.tickCount - 1);
  }

  getTickPosition(index: number): string {
    return `${index * this.step}px`;
  }

  generateProblem(): void {
    // Reset state
    this.circleChosen = false;
    this.directionChosen = false;
    this.circleType = 'open';
    this.direction = null;
    this.markerPosition = null;
    this.errorMessage = '';
    this.message = '';

    // Hide visual elements
    this.showMarker = false;
    this.showLine = false;
    this.showArrow = false;

    // Generate random problem
    this.targetValue = Math.floor(Math.random() * 21) - 10; // Random number from -10 to 10
    const includeEqual = Math.random() < 0.5; // 50% chance to include equality
    const dir: Direction = Math.random() < 0.5 ? 'left' : 'right'; // Randomly pick direction

    // Adjust inequality based on direction
    if (dir === 'right') {
      this.inequality = includeEqual ? '≥' : '>';
    } else {
      this.inequality = includeEqual ? '≤' : '<';
    }

    // Update the title
    this.title = `Graph the Inequality: x ${this.inequality} ${this.targetValue}`;

    console.log(`Target inequality: x ${this.inequality} ${this.targetValue}`);
  }

  setCircleType(type: CircleType): void {
    this.circleType = type;
    this.circleChosen = true;

    if (this.markerPosition !== null) {
      this.updateMarker();
    }
  }

  setDirection(dir: Direction): void {
    this.direction = dir;
    this.directionChosen = true;

    if (this.markerPosition !== null) {
      this.updateMarker();
    }
  }

  handleClick(event: MouseEvent): void {
    if (!this.circleChosen) {
      this.errorMessage = 'Please select a circle type before placing a marker.';
      return;
    }

    if (!this.directionChosen) {
      this.errorMessage = 'Please select a direction before placing a marker.';
      return;
    }

    // Clear any previous error message
    this.errorMessage = '';

    const rect = this.numberLineContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;

    // Calculate the closest tick
    const closestIndex = Math.round(x / this.step);
    this.markerPosition = closestIndex - 10; // Store position on number line

    // Place the marker and draw the line
    this.placeMarker(closestIndex);
    this.drawLine(closestIndex, this.direction!);
  }

  placeMarker(index: number): void {
    this.markerLeft = `${index * this.step}px`;
    this.isMarkerOpen = this.circleType === 'open';
    this.showMarker = true;
  }

  updateMarker(): void {
    if (this.markerPosition === null) {
      this.message = 'Please place a marker first!';
      return;
    }

    const closestIndex = this.markerPosition + 10;
    this.placeMarker(closestIndex);
    this.drawLine(closestIndex, this.direction!);
  }

  drawLine(startIndex: number, direction: Direction): void {
    const containerWidth = this.numberLineContainer.nativeElement.offsetWidth;

    if (direction === 'right') {
      this.lineLeft = `${startIndex * this.step}px`;
      this.lineWidth = `${containerWidth - startIndex * this.step}px`;
      this.arrowLeft = `${containerWidth - 5}px`;
      this.isArrowRight = true;
    } else {
      this.lineLeft = '0px';
      this.lineWidth = `${startIndex * this.step}px`;
      this.arrowLeft = '5px';
      this.isArrowRight = false;
    }

    this.showLine = true;
    this.showArrow = true;
  }

  checkAnswer(): void {
    if (!this.showMarker) {
      this.errorMessage = 'Please place a marker first!';
      return;
    }

    console.log('Correct Answer Details:');
    console.log(`  Target Value: ${this.targetValue}`);
    console.log(`  Inequality: ${this.inequality}`);
    console.log('User Input Details:');
    console.log(`  Marker Position: ${this.markerPosition}`);
    console.log(`  Selected Circle Type: ${this.circleType}`);
    console.log(`  Selected Direction: ${this.direction}`);

    const correctPosition = this.markerPosition === this.targetValue;
    let correctCircle = false;
    let correctDirection = false;

    // Check if the circle type matches the inequality type
    if (
      (this.inequality === '≥' && this.circleType === 'closed') ||
      (this.inequality === '>' && this.circleType === 'open') ||
      (this.inequality === '≤' && this.circleType === 'closed') ||
      (this.inequality === '<' && this.circleType === 'open')
    ) {
      correctCircle = true;
    }

    // Validate direction based on inequality
    if (
      (this.inequality === '>' || this.inequality === '≥') &&
      this.direction === 'right'
    ) {
      correctDirection = true;
    } else if (
      (this.inequality === '<' || this.inequality === '≤') &&
      this.direction === 'left'
    ) {
      correctDirection = true;
    }

    // Combine checks for result
    if (correctPosition && correctCircle && correctDirection) {
      this.errorMessage = '';
      this.message = 'Correct!';
      this.correctCount++;

      console.log('Result: Correct!');

      // Automatically generate a new problem after 1 second
      setTimeout(() => {
        this.message = '';
        this.generateProblem();
      }, 1000);
    } else {
      this.incorrectCount++;

      if (!correctDirection) {
        this.errorMessage = 'Incorrect direction! Adjust it and try again.';
        console.log('Result: Incorrect direction!');
      } else if (!correctCircle) {
        this.errorMessage = 'Incorrect circle type! Adjust it and try again.';
        console.log('Result: Incorrect circle type!');
      } else {
        this.errorMessage = 'Incorrect position! Try again.';
        console.log('Result: Incorrect position!');
      }
    }
  }
}
