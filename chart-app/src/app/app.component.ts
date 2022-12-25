import { Component } from '@angular/core';
import {ChartClient} from "../../chart-library/src/client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chart-app';

  constructor() {
    new ChartClient();
  }
}
